<section id="client-register-section">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h2 style="font-size: 1.1em; margin: 0;">👤 利用者 登録/編集</h2>
        <button type="button" id="open-client-modal" style="background: #6c757d; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">一覧から選択</button>
    </div>

    <form id="client-register-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div style="grid-column: span 2; border-bottom: 1px solid #eee; padding-bottom: 5px; font-weight: bold; color: #0056b3;">基本情報</div>
            <div>
                <label>利用者ID (新規は空欄)</label>
                <input type="text" id="reg-client-id" placeholder="自動採番">
            </div>
            <div>
                <label>利用者氏名</label>
                <input type="text" id="reg-client-name" required>
            </div>
            <div>
                <label>郵便番号</label>
                <div style="display: flex; gap: 5px;">
                    <input type="text" id="reg-zipcode" placeholder="1234567">
                    <button type="button" id="search-zipcode" style="background: #f8f9fa; border: 1px solid #ccc; padding: 0 10px; border-radius: 4px; cursor: pointer; white-space: nowrap;">検索</button>
                </div>
            </div>
            <div>
                <label>連絡先電話番号</label>
                <input type="text" id="reg-contact-tel">
            </div>
            <div style="grid-column: span 2;">
                <label>住所</label>
                <input type="text" id="reg-address">
            </div>
            <div style="grid-column: span 2; border-bottom: 1px solid #eee; padding-bottom: 5px; font-weight: bold; color: #0056b3; margin-top: 10px;">介護・保険情報</div>
            <div><label>介護保険番号</label><input type="text" id="reg-insurance"></div>
            <div><label>ケアマネジャー名</label><input type="text" id="reg-care-manager"></div>
            <div><label>認定有効開始日</label><input type="date" id="reg-start-date"></div>
            <div><label>認定有効終了日</label><input type="date" id="reg-end-date"></div>
            <div><label>ケアマネ連絡先</label><input type="text" id="reg-care-manager-tel"></div>
        </div>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" id="client-delete-btn" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; display: none;">削除する</button>
            <button type="button" id="form-reset-btn" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">クリア</button>
            <button type="submit" id="client-submit-btn" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">情報を保存する</button>
        </div>
    </form>
</section>