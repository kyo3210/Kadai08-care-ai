let vitalChart = null;

function clearVitalChart() {
    if (vitalChart) { vitalChart.destroy(); vitalChart = null; }
    const canvas = document.getElementById('vitalChart');
    if (canvas) { canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); }
}

function updateVitalChart(vitalData) {
    const canvas = document.getElementById('vitalChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (vitalChart) { vitalChart.destroy(); }
    vitalData.sort((a, b) => new Date(a.date) - new Date(b.date));
    vitalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: vitalData.map(d => d.date),
            datasets: [
                { label: '体温(℃)', data: vitalData.map(d => d.temp), borderColor: '#ff6384', backgroundColor: 'rgba(255, 99, 132, 0.2)', yAxisID: 'y-temp', tension: 0.3 },
                { label: '血圧(上)', data: vitalData.map(d => d.bp_high), borderColor: '#36a2eb', backgroundColor: 'rgba(54, 162, 235, 0.2)', yAxisID: 'y-bp', tension: 0.3 },
                { label: '血圧(下)', data: vitalData.map(d => d.bp_low), borderColor: '#4bc0c0', backgroundColor: 'rgba(75, 192, 192, 0.2)', yAxisID: 'y-bp', tension: 0.3 }
            ]
        },
        options: { responsive: true, scales: { 'y-temp': { min: 34, max: 40 }, 'y-bp': { min: 40, max: 200 } } }
    });
}

$(document).ready(function() {
    $('.quick-date-btn').on('click', function() {
        const range = $(this).data('range');
        const end = new Date();
        const start = new Date();
        if (range === 'week') {
            start.setDate(end.getDate() - 7);
        } else if (range === 'month') {
            start.setDate(1);
        }
        $('#search-start-date').val(start.toISOString().split('T')[0]);
        $('#search-end-date').val(end.toISOString().split('T')[0]);
        $('#update-graph-btn').trigger('click');
    });

    $('#update-graph-btn').on('click', async function() {
        const cid = $('#client-select').val();
        if (!cid) return alert("利用者を選択してください");
        try {
            const res = await axios.post('/web-api/ask-ai', { clientId: cid, question: '', startDate: $('#search-start-date').val(), endDate: $('#search-end-date').val(), systemPrompt: '分析用データ取得' });
            if (res.data.vitalData) updateVitalChart(res.data.vitalData);
        } catch (e) { alert("データ取得エラー"); }
    });

    $('#chat-clear-btn, #chart-clear-btn').on('click', function() {
        if (confirm('表示をリセットしますか？')) {
            if (this.id === 'chat-clear-btn') $('#chat-window').empty();
            $('#search-start-date, #search-end-date').val('');
            clearVitalChart();
        }
    });
});