// =======================================================
// 利用者・事業所・職員管理ロジック
// =======================================================

/**
 * 利用者リストの取得とセレクトボックス・自動採番の更新
 */
async function fetchClients() {
    try {
        const response = await axios.get('/web-api/clients');
        
        // --- 【新規追加】ダッシュボードの更新対象者リストを表示 ---
        renderExpiryAlertList(response.data);

        // --- 【ID自動採番ロジック】 -Infinityエラーを回避 ---
        let nextId = ""; 
        if (response.data && response.data.length > 0) {
            const ids = response.data.map(c => parseInt(c.id)).filter(id => !isNaN(id));
            if (ids.length > 0) {
                nextId = Math.max(...ids) + 1;
            }
        }

        const $idInput = $('#reg-client-id');
        // 新規登録モード（readonlyでない）かつ入力が空の場合のみ最新IDをセット
        if (!$idInput.prop('readonly') && (!$idInput.val() || $idInput.val() === "")) {
            $idInput.val(nextId);
        }

        // 各画面の利用者選択プルダウンを更新
        ['#client-select', '#record-client-select', '#sch-client-select', '#edit-sch-client-select'].forEach(id => {
            const $el = $(id); 
            $el.empty().append('<option value="">利用者を選択してください</option>');
            response.data.forEach(c => {
                $el.append(`<option value="${c.id}">${c.id}: ${c.client_name}</option>`);
            });
        });
    } catch (e) { 
        console.error("利用者リスト取得エラー:", e); 
    }
}

/**
 * 認定期限が近い（1ヶ月以内）利用者を抽出し、ダッシュボードに一覧表示する
 */
function renderExpiryAlertList(clients) {
    const today = new Date();
    // 判定基準：今日から1ヶ月後
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    // 期限切れ、または1ヶ月以内に期限が切れる利用者を抽出
    const alertList = clients.filter(c => {
        if (!c.care_end_date) return false;
        const endDate = new Date(c.care_end_date);
        return endDate <= nextMonth;
    }).sort((a, b) => new Date(a.care_end_date) - new Date(b.care_end_date));

    const $section = $('#expiry-alert-section');
    const $tbody = $('#expiry-list-body');

    if (alertList.length > 0) {
        $tbody.empty();
        alertList.forEach(c => {
            const endDate = new Date(c.care_end_date);
            const isExpired = endDate < today;
            
            // 状態に応じたスタイル定義
            const statusStyle = isExpired ? 'color: #d9534f; font-weight: bold;' : 'color: #f0ad4e; font-weight: bold;';
            const statusText = isExpired ? '⚠️ 期限切れ' : '⏳ まもなく期限';

            $tbody.append(`
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px; text-align: left;">${c.client_name}</td>
                    <td style="padding: 8px; text-align: center;">${c.care_end_date}</td>
                    <td style="padding: 8px; text-align: center; ${statusStyle}">${statusText}</td>
                </tr>
            `);
        });
        // 対象者がいる場合のみセクションを表示
        $section.fadeIn(300);
    } else {
        // 対象者がいない場合は非表示
        $section.hide();
    }
}

/**
 * 事業所情報の取得と反映
 */
async function fetchOfficeInfo() {
    try {
        const response = await axios.get('/web-api/offices');
        if (response.data.length > 0) {
            const office = response.data[0];
            $('#prov-id').val(office.id); 
            $('#prov-name').val(office.name); 
            $('#prov-postcode').val(office.postcode); 
            $('#prov-tel').val(office.tel); 
            $('#prov-address').val(office.address);
            $('#target-office-id').val(office.id);
        }
    } catch (e) { 
        console.error("事業所情報取得エラー:", e); 
    }
}

/**
 * 職員リストの取得と表示
 */
async function fetchStaffList() {
    try {
        const res = await axios.get('/web-api/staff');
        const $list = $('#staff-list'); 
        if (res.data.length === 0) {
            $list.html('<p style="padding: 10px; color: #999; font-size: 0.9em;">登録された職員はいません</p>');
            return;
        }
        const html = res.data.map(s => `
            <div style="padding: 8px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; color: #444;">${s.name}</span>
                <span style="font-size: 0.85em; color: #777;">${s.email}</span>
            </div>`).join('');
        $list.html(html);
    } catch (e) { 
        console.error("職員リスト取得エラー:", e); 
    }
}

/**
 * モーダル用利用者一覧のレンダリング
 */
async function renderModalClientList() {
    const res = await axios.get('/web-api/clients');
    let html = res.data.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.client_name}</td>
            <td>${c.address}</td>
            <td style="text-align:center;">
                <button type="button" class="select-client-btn" data-client='${JSON.stringify(c)}' 
                    style="background:#007bff; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">編集</button>
            </td>
        </tr>`).join('');
    $('#modal-client-table-body').html(html);
}

/**
 * モーダル用ケア記録一覧のレンダリング（フィルタ・ソート機能保持）
 */
async function renderRecordList() {
    try {
        const [res, clientRes, staffRes] = await Promise.all([
            axios.get('/web-api/all-records'),
            axios.get('/web-api/clients'),
            axios.get('/web-api/staff')
        ]);
        const clientMap = {};
        clientRes.data.forEach(c => clientMap[c.id] = c.client_name);

        const $staffSelect = $('#filter-staff-select');
        $staffSelect.find('option:not(:first)').remove();
        staffRes.data.forEach(s => $staffSelect.append(`<option value="${s.name}">${s.name}</option>`));

        let html = res.data.map(r => {
            const clientName = clientMap[r.client_id] || "不明";
            return `<tr>
                <td style="font-size:0.85em; border:1px solid #ddd; padding:8px;">${r.recorded_at.substring(0, 16)}</td>
                <td style="border:1px solid #ddd; padding:8px;">${r.client_id}: ${clientName}</td>
                <td style="border:1px solid #ddd; padding:8px;">${r.recorded_by || '-'}</td>
                <td style="text-align:center; border:1px solid #ddd; padding:8px;">${r.body_temp || '-'}</td>
                <td style="text-align:center; border:1px solid #ddd; padding:8px;">${r.blood_pressure_high || '-'}</td>
                <td style="text-align:center; border:1px solid #ddd; padding:8px;">${r.water_intake || '-'}</td>
                <td style="max-width:350px; border:1px solid #ddd; padding:8px; font-size:0.85em; line-height:1.4; word-break:break-all;">${r.content}</td>
                <td style="text-align:center; border:1px solid #ddd; padding:8px;">
                    <button type="button" class="select-record-btn" data-record='${JSON.stringify(r)}' 
                        style="background:#6c757d; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">編集</button>
                </td>
            </tr>`;
        }).join('');
        $('#modal-record-table-body').html(html);
    } catch (e) { 
        console.error("過去記録取得エラー:", e); 
    }
}

/**
 * 初期表示設定
 */
function saveStartPageSetting(value) { localStorage.setItem('care_ai_start_page', value); }
function applyStartPage() {
    const startPage = localStorage.getItem('care_ai_start_page') || 'dashboard';
    if ($('#start-page-setting').length) $('#start-page-setting').val(startPage);
    if (typeof showTab === 'function') showTab(startPage);
}

// =======================================================
// イベントハンドラ設定
// =======================================================
$(document).ready(function() {
    fetchClients(); 
    fetchOfficeInfo(); 
    fetchStaffList(); 
    applyStartPage();

    // 職員登録
    $('#staff-register-form').on('submit', async function(e) {
        e.preventDefault();
        const data = { 
            name: $('#staff-name').val(), 
            email: $('#staff-email').val(), 
            password: $('#staff-password').val(), 
            office_id: $('#target-office-id').val() 
        };
        try {
            const res = await axios.post('/web-api/staff', data);
            if (res.data.status === 'success') { alert("登録完了"); fetchStaffList(); }
        } catch (e) { alert("登録失敗"); }
    });

    // 利用者情報の保存（サーバーのルート制限を回避するため POST に一本化）
    $('#client-register-form').on('submit', async function(e) {
        e.preventDefault();
        
        const isEditMode = $('#reg-client-id').prop('readonly');
        const clientId = $('#reg-client-id').val();

        // client.blade.php の ID と、実際のDBのカラム名（insurace_number等）に準拠したデータ構築
        const data = { 
            id: clientId, 
            client_name: $('#reg-client-name').val(), 
            postcode: $('#reg-zipcode').val(), 
            address: $('#reg-address').val(),
            contact_tel: $('#reg-contact-tel').val(),
            insurace_number: $('#reg-insurance').val(), // DBカラム名: insurace_number (n抜き)
            care_manager: $('#reg-care-manager').val(),
            care_start_date: $('#reg-start-date').val(),
            care_end_date: $('#reg-end-date').val(),
            care_manager_tel: $('#reg-care-manager-tel').val()
        };

        // バリデーションチェック（JS側）
        const fields = [
            { id: '#reg-client-id', val: data.id, label: "利用者ID" },
            { id: '#reg-client-name', val: data.client_name, label: "利用者氏名" },
            { id: '#reg-zipcode', val: data.postcode, label: "郵便番号" },
            { id: '#reg-address', val: data.address, label: "住所" },
            { id: '#reg-contact-tel', val: data.contact_tel, label: "連絡先電話番号" },
            { id: '#reg-insurance', val: data.insurace_number, label: "介護保険番号" },
            { id: '#reg-care-manager', val: data.care_manager, label: "ケアマネジャー名" },
            { id: '#reg-start-date', val: data.care_start_date, label: "認定有効開始日" },
            { id: '#reg-end-date', val: data.care_end_date, label: "認定有効終了日" },
            { id: '#reg-care-manager-tel', val: data.care_manager_tel, label: "ケアマネ連絡先" }
        ];

        let errorMessages = [];
        fields.forEach(f => {
            if (!f.val || f.val.trim() === "") errorMessages.push(`・${f.label}が入力されていません。`);
        });

        if (errorMessages.length > 0) {
            alert("【入力エラー】\n\n" + errorMessages.join("\n"));
            return; 
        }

        try { 
            // サーバー側のルート設定(PATCH未定義)を考慮し、
            // 既存の POST /web-api/clients を使用して「登録または更新」を行います。
            const response = await axios.post('/web-api/clients', data); 
            
            if (isEditMode) {
                alert("利用者情報を上書き更新しました。"); 
            } else {
                alert("新規登録が完了しました。"); 
            }
            
            $('#client-register-form')[0].reset();
            $('#reg-client-id').prop('readonly', false).css('background-color', '').val('');
            fetchClients(); 
        } catch (e) { 
            console.error("保存失敗:", e.response?.data);
            const msg = e.response?.data?.message || "通信エラーが発生しました。";
            alert("保存に失敗しました：\n" + msg);
        }
    });

    // ケア記録フィルタ機能（ロジック維持）
    $(document).on('input change', '.record-filter', function() {
        const start = $('#filter-date-start').val();
        const end = $('#filter-date-end').val();
        const filters = $('.record-filter').map(function() { 
            return { col: $(this).data('col'), val: $(this).val().toLowerCase() }; 
        }).get();

        $('#modal-record-table-body tr').each(function() {
            const row = $(this); 
            const tds = row.find('td'); 
            const rDate = tds.eq(0).text().substring(0, 10);
            let show = (start && rDate < start) || (end && rDate > end) ? false : true;
            filters.forEach(f => { 
                if (f.val && tds.eq(f.col).text().toLowerCase().indexOf(f.val) === -1) show = false; 
            });
            show ? row.show() : row.hide();
        });
    });

    // 郵便番号検索
    $('#search-zipcode').on('click', async function() {
        const zip = $('#reg-zipcode').val().replace(/[^0-9]/g, '');
        try {
            const res = await axios.get(`/web-api/zipcode/${zip}`);
            if (res.data.results) {
                $('#reg-address').val(res.data.results[0].address1 + res.data.results[0].address2 + res.data.results[0].address3);
            }
        } catch (e) { alert("検索失敗"); }
    });

    // モーダル開閉制御
    $('#add-schedule-btn').on('click', () => $('#schedule-modal').fadeIn(200));
    $('#open-record-modal').on('click', () => { renderRecordList(); $('#record-modal').fadeIn(200); });
    $('#close-schedule-modal, .close-edit-modal, #close-record-modal, #close-client-modal').on('click', () => $('.modal').fadeOut(200));

    // クリア（リセット）ボタンの動作
    $('#form-reset-btn').on('click', function() {
        $('#client-register-form')[0].reset();
        $('#reg-client-id').prop('readonly', false).css('background-color', '').val('');
        fetchClients(); 
    });

    // --- 【反映ロジック】一覧モーダルで利用者を選択した際、全項目を入力欄へ表示 ---
    $(document).on('click', '.select-client-btn', function() { 
        const c = $(this).data('client'); 
        
        // ID固定化（編集モード）
        $('#reg-client-id').val(c.id).prop('readonly', true).css('background-color', '#e9ecef'); 
        
        // データの反映（実際のDBカラム名 insurace_number 等に準拠）
        $('#reg-client-name').val(c.client_name); 
        $('#reg-zipcode').val(c.postcode); 
        $('#reg-address').val(c.address);
        $('#reg-contact-tel').val(c.contact_tel || '');
        
        $('#reg-insurance').val(c.insurace_number || '');          
        $('#reg-care-manager').val(c.care_manager || '');
        $('#reg-start-date').val(c.care_start_date || '');          
        $('#reg-end-date').val(c.care_end_date || '');              
        $('#reg-care-manager-tel').val(c.care_manager_tel || '');    
        
        $('#client-modal').fadeOut(200); 
    });
    
    // 利用者一覧モーダルを開く
    $('#open-client-modal').on('click', function() { 
        renderModalClientList(); 
        $('#client-modal').fadeIn(200); 
    });
});