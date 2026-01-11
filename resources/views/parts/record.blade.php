<section id="record-register-section">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h2 style="font-size: 1.1em; margin: 0;">📝 ケア記録・バイタル入力</h2>
        <button type="button" id="open-record-modal" style="background: #6c757d; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">過去記録編集</button>
    </div>
    <form id="record-add-form">
        {{-- ★追加: スケジュールID連携用の隠しフィールド --}}
        <input type="hidden" id="record-schedule-id" name="schedule_id">
        <input type="hidden" id="edit-record-id">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <select id="record-client-select" required style="grid-column: span 2;"></select>
            <input type="date" id="record-date" required>
            <input type="time" id="record-time" required>
            <input type="number" id="record-temp" step="0.1" placeholder="体温 ℃">
            <input type="number" id="record-water" placeholder="水分 ml">
            <input type="number" id="record-bp-high" placeholder="血圧(上)">
            <input type="number" id="record-bp-low" placeholder="血圧(下)">
            <textarea id="record-content" placeholder="ケア内容・特記事項を入力してください" style="grid-column: span 2; height: 80px;"></textarea>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" id="record-reset-btn" style="display: none; background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px;">新規作成へ戻る</button>
            <button type="submit" id="record-submit-btn" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; background-color: #007bff;">記録を保存</button>
        </div>
    </form>
</section>