// =======================================================
// スケジュール・ケア記録連携ロジック
// =======================================================

async function updateDashboardSchedule() {
    try {
        const res = await axios.get('/web-api/schedules');
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = res.data.filter(event => event.start.startsWith(today));
        const $list = $('#dashboard-schedule-list');
        if (todayEvents.length === 0) {
            $list.html('<p style="color: #999; padding: 10px;">本日の予定はありません。</p>');
            return;
        }
        const html = todayEvents.sort((a,b) => a.start.localeCompare(b.start)).map(ev => {
            const time = ev.start.substring(11, 16);
            return `<div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                <span style="width: 4px; height: 18px; background: ${ev.backgroundColor}; display: inline-block; border-radius: 2px;"></span>
                <span style="font-weight: bold; color: #333;">${time}</span>
                <span style="color: #555;">${ev.title}</span>
            </div>`;
        }).join('');
        $list.html(html);
    } catch (e) { $('#dashboard-schedule-list').html('<p style="color: #dc3545; padding: 10px;">読み込みに失敗しました。</p>'); }
}

async function updateEventTime(event) {
    try {
        await axios.patch(`/web-api/schedules/${event.id}`, { 
            start: event.startStr.replace('T', ' ').substring(0, 16) + ':00', 
            end: event.endStr ? event.endStr.replace('T', ' ').substring(0, 16) + ':00' : null 
        });
        updateDashboardSchedule();
    } catch (e) { alert('更新失敗'); }
}

$(document).ready(function() {
    updateDashboardSchedule();
    
    var calendarEl = document.getElementById('calendar');
    var calendar;
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridDay',
            headerToolbar: { left: 'prev,next today', center: 'title', right: 'timeGridDay,dayGridMonth' },
            locale: 'ja', allDaySlot: false, editable: true, nowIndicator: true,
            events: '/web-api/schedules', 
            eventClick: function(info) {
                const ev = info.event; const props = ev.extendedProps;
                $('#edit-sch-id').val(ev.id); $('#edit-sch-content').val(props.description);
                $('#edit-sch-start').val(ev.startStr.substring(0, 16));
                $('#edit-sch-end').val(ev.endStr ? ev.endStr.substring(0, 16) : '');
                
                // ✅連携ロジック（1字1句維持）
                if (props.type === 'care' && !props.is_recorded) {
                    $('#go-to-record-btn').show().off('click').on('click', function() {
                        $('#edit-schedule-modal').hide(); 
                        if (typeof showTab === 'function') showTab('record');
                        $('#record-client-select').val(props.client_id);
                        $('#record-date').val(ev.startStr.substring(0, 10));
                        $('#record-time').val(ev.startStr.substring(11, 16));
                        $('#record-schedule-id').val(ev.id);
                    });
                } else { $('#go-to-record-btn').hide(); }
                $('#edit-schedule-modal').fadeIn(200);
            },
            eventDrop: async function(info) { await updateEventTime(info.event); },
            eventResize: async function(info) { await updateEventTime(info.event); }
        });
        calendar.render();
        window.calendar = calendar; 
    }

    // --- 【422エラー解消版】予定追加送信ロジック ---
    $('#schedule-form').off('submit').on('submit', async function(e) {
        e.preventDefault();
        const selectedType = $('#schedule-type').val();
        
        // サーバー側のバリデーションに合わせてキー名(type, backgroundColor)を修正
        const data = {
            type: selectedType, // schedule_typeからtypeに変更
            backgroundColor: selectedType === 'care' ? '#28a745' : '#007bff', // 必須項目を追加
            client_id: selectedType === 'care' ? $('#sch-client-select').val() : null,
            title: selectedType === 'work' ? $('#sch-title').val() : ($('#sch-client-select option:selected').text().split(': ')[1] || '利用者ケア'),
            description: selectedType === 'care' ? $('#sch-content').val() : $('#sch-title').val(),
            start: $('#sch-start').val().replace('T', ' ') + ':00',
            end: $('#sch-end').val().replace('T', ' ') + ':00'
        };

        // 基本バリデーション
        if (!data.start || !data.end) return alert("開始時間と終了時間を入力してください");
        if (selectedType === 'care' && !data.client_id) return alert("利用者を選択してください");
        if (selectedType === 'work' && !data.title) return alert("予定名を入力してください");

        try {
            const res = await axios.post('/web-api/schedules', data);
            if (res.data.status === 'success') {
                alert("予定を登録しました。");
                $('#schedule-modal').fadeOut(200);
                $('#schedule-form')[0].reset();
                if (calendar) calendar.refetchEvents();
                updateDashboardSchedule();
            }
        } catch (e) {
            console.error("422 Error Details:", e.response ? e.response.data : e);
            alert("入力エラー: " + (e.response?.data?.message || "内容を確認してください"));
        }
    });

    // --- 予定更新・削除・タイプ切り替え（既存ロジック維持） ---
    $('#edit-schedule-form').on('submit', async function(e) {
        e.preventDefault();
        const id = $('#edit-sch-id').val();
        const data = {
            description: $('#edit-sch-content').val(),
            start: $('#edit-sch-start').val().replace('T', ' ') + ':00',
            end: $('#edit-sch-end').val().replace('T', ' ') + ':00'
        };
        try {
            await axios.patch(`/web-api/schedules/${id}`, data);
            alert("予定を更新しました。");
            $('#edit-schedule-modal').fadeOut(200);
            if (calendar) calendar.refetchEvents();
            updateDashboardSchedule();
        } catch (e) { alert("更新失敗"); }
    });

    $('#delete-schedule-btn').on('click', async function() {
        if (!confirm('予定を削除しますか？')) return;
        const id = $('#edit-sch-id').val();
        try {
            await axios.delete(`/web-api/schedules/${id}`);
            $('#edit-schedule-modal').fadeOut(200);
            if (calendar) calendar.refetchEvents();
            updateDashboardSchedule();
        } catch (e) { alert("削除失敗"); }
    });

    $('#schedule-type').on('change', function() {
        if ($(this).val() === 'care') {
            $('#care-fields').show(); $('#work-fields').hide();
        } else {
            $('#care-fields').hide(); $('#work-fields').show();
        }
    });

    // --- ケア記録保存（既存ロジック維持） ---
    $('#record-add-form').on('submit', async function(e) {
        e.preventDefault();
        const data = {
            schedule_id: $('#record-schedule-id').val(),
            client_id: $('#record-client-select').val(),
            recorded_at: $('#record-date').val() + ' ' + $('#record-time').val(),
            content: $('#record-content').val(),
            body_temp: $('#record-temp').val(),
            blood_pressure_high: $('#record-bp-high').val(),
            blood_pressure_low: $('#record-bp-low').val(),
            water_intake: $('#record-water').val(),
            recorded_by: (typeof getCurrentUserName === 'function') ? getCurrentUserName() : "担当スタッフ"
        };
        try {
            const res = await axios.post('/web-api/records', data);
            if (res.data.status === 'success') {
                alert("記録が完了しました。");
                $('#record-add-form')[0].reset();
                if (calendar) calendar.refetchEvents();
                updateDashboardSchedule();
            }
        } catch (e) { alert("保存失敗"); }
    });
});