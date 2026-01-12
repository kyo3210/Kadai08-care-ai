// =======================================================
// 1. 初期設定・プロンプト（ペルソナ）設定
// =======================================================
axios.defaults.withCredentials = true;
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

const SYSTEM_PROMPT = [
    "あなたは介護現場の第一線で活躍し、後輩の指導やご家族対応も担当する『ベテランの介護現場リーダー（主任クラス）』です。",
    "提示された期間指定とバイタル数値の変化、およびケア内容に基づき、現場を支える責任者の視点で簡潔に回答を行ってください。",
    "【回答の指針】",
    "1. 現場視点の要約：客観的なデータに基づき、現場で今何が起きているのか、実務的な視点で簡潔に要約してください。",
    "2. ご家族への配慮：ご家族への報告や説明時に配慮すべき点（安心感を与える伝え方や注意点など）は、質問者から求められた場合に限り、具体的に提案してください。",
    "3. 実務的な助言：具体的な対応方針や後輩スタッフへの指導、リスク回避のヒントは、質問者から明確に求められた場合にのみ回答してください。",
    "4. 整形ルール：回答はHTMLの<br>タグのみを使用して整形してください。読み上げの妨げになる「＊」「■」「・」などの記号は一切使用しないでください。",
    "5. 口調：現場を共に守る仲間として、信頼感と温かみがあり、かつプロとしての鋭さも兼ね備えた落ち着いた口調で回答してください。"
].join('\n');

function getCurrentUserName() {
    return document.querySelector('meta[name="user-name"]')?.getAttribute('content') || "担当スタッフ";
}

function appendMessage(sender, message) {
    const chatWindow = $('#chat-window');
    const messageClass = sender === 'user' ? 'user-message' : 'ai-message';
    let html = '';
    if (sender === 'ai') {
        html = `<div class="${messageClass}" style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 15px;"> 
                <img src="/images/AI.gif" alt="AI" style="height: 35px; width: 35px; border-radius: 50%;">
                <div style="background: #eef4ff; padding: 12px; border-radius: 12px; color: #0056b3; line-height: 1.6; border: 1px solid #d1e3f8;">${message}</div>
            </div>`;
    } else {
        html = `<div class="${messageClass}" style="display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-bottom: 10px;">
                <div style="background: #f0f0f0; padding: 10px; border-radius: 10px; color: #333;">${message}</div>
                <img src="/images/Q.png" alt="Q" style="height: 25px; width: 25px;">
            </div>`;
    }
    chatWindow.append(html);
    chatWindow.scrollTop(chatWindow[0].scrollHeight);
}

function speakText(text) {
    if (!$('#voice-read-toggle').prop('checked')) return;
    let cleanText = text.replace(/<[^>]*>/g, '').replace(/[＊\*・■□▲△▼▽：｜｜]/g, ' ');
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP'; utterance.rate = 0.95; utterance.pitch = 0.85; 
    window.speechSynthesis.speak(utterance);
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.onstart = () => { $('#voice-input-btn').css('background', '#dc3545').text('●'); };
    recognition.onresult = (e) => { $('#user-input').val(e.results[0][0].transcript); };
    recognition.onend = () => { $('#voice-input-btn').css('background', '#007bff').text('🎤'); };
}

$(document).ready(function() {
    $('#voice-input-btn').on('click', function() { if (recognition) recognition.start(); });
    $(document).on('change', '#voice-read-toggle', function() {
        const isChecked = $(this).prop('checked');
        const $bg = $('#toggle-bg'); const $circle = $('#toggle-circle');
        if (isChecked) {
            $bg.css('background-color', '#28a745');
            $circle.css('transform', 'translateX(22px)');
        } else {
            window.speechSynthesis.cancel();
            $bg.css('background-color', '#ccc');
            $circle.css('transform', 'translateX(0px)');
        }
    });

    $('#chat-form').on('submit', async function(e) {
        e.preventDefault();
        const q = $('#user-input').val(); if (!q.trim()) return;
        const cid = $('#client-select').val();
        appendMessage('user', q); $('#user-input').val(''); appendMessage('ai', '分析中...');
        try {
            const res = await axios.post('/web-api/ask-ai', { clientId: cid, question: q, startDate: $('#search-start-date').val(), endDate: $('#search-end-date').val(), systemPrompt: SYSTEM_PROMPT });
            $('.ai-message').last().remove(); appendMessage('ai', res.data.answer); speakText(res.data.answer);
            if(cid && res.data.vitalData && typeof updateVitalChart === 'function') updateVitalChart(res.data.vitalData);
        } catch (e) { $('.ai-message').last().remove(); appendMessage('ai', '通信エラー'); }
    });
});