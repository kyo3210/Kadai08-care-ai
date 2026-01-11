<section id="schedule-section">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h2 style="font-size: 1.1em; margin: 0;">📅 スケジュール管理</h2>
        <button type="button" id="add-schedule-btn" style="background: #007bff; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">予定追加</button>
    </div>
    
    <div id="calendar" style="background: white; padding: 10px; border-radius: 8px; min-height: 400px;"></div>

    <div id="schedule-modal" class="modal">
        <div class="modal-content" style="max-width: 500px;">
            <h3 id="schedule-modal-title">予定の登録</h3>
            <form id="schedule-form">
                <div style="margin-bottom: 15px;">
                    <label>予定タイプ</label>
                    <select id="schedule-type" required>
                        <option value="care">利用者ケア予定</option>
                        <option value="work">業務予定(研修・会議等)</option>
                    </select>
                </div>

                <div id="care-fields">
                    <label>利用者</label>
                    <select id="sch-client-select"></select>
                    <label>ケア内容・指示情報</label>
                    <textarea id="sch-content" placeholder="例: 入浴介助、バイタル測定"></textarea>
                </div>

                <div id="work-fields" style="display:none;">
                    <label>予定名</label>
                    <input type="text" id="sch-title" placeholder="例: 全体会議">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                    <div><label>開始時間</label><input type="datetime-local" id="sch-start" required></div>
                    <div><label>終了時間</label><input type="datetime-local" id="sch-end" required></div>
                </div>

                <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" id="close-schedule-modal" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px;">キャンセル</button>
                    <button type="submit" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px;">保存する</button>
                </div>
            </form>
        </div>
    </div>

    <div id="edit-schedule-modal" class="modal">
        <div class="modal-content" style="max-width: 500px;">
            <h3>予定の詳細・編集</h3>
            <form id="edit-schedule-form">
                <input type="hidden" id="edit-sch-id"> {{-- 予定のIDを保持 --}}
                
                <div style="margin-bottom: 15px;">
                    <label>予定タイプ</label>
                    <select id="edit-schedule-type" required>
                        <option value="care">① 利用者ケア (個別)</option>
                        <option value="work">② 業務 (研修・会議等)</option>
                    </select>
                </div>

                <div id="edit-care-fields">
                    <label>利用者</label>
                    <select id="edit-sch-client-select"></select>
                </div>

                <div id="edit-work-fields" style="display:none;">
                    <label>予定名</label>
                    <input type="text" id="edit-sch-title">
                </div>

                <div style="margin-top: 10px;">
                    <label>メモ・指示内容</label>
                    <textarea id="edit-sch-content" style="height: 80px;"></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                    <div><label>開始時間</label><input type="datetime-local" id="edit-sch-start" required></div>
                    <div><label>終了時間</label><input type="datetime-local" id="edit-sch-end" required></div>
                </div>

                <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                    {{-- ★追加: 記録画面へジャンプするボタン --}}
                    <button type="button" id="go-to-record-btn" style="display:none; background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">📝 記録を書く</button>
                    
                    <div style="display: flex; gap: 5px;">
                        <button type="button" id="delete-schedule-btn" style="background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 4px;">削除</button>
                        <button type="button" class="close-edit-modal" style="background: #6c757d; color: white; border: none; padding: 10px 15px; border-radius: 4px;">戻る</button>
                        <button type="submit" style="background: #007bff; color: white; border: none; padding: 10px 15px; border-radius: 4px;">更新</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</section>

<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>