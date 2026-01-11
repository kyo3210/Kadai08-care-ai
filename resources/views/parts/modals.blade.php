<div id="client-modal" class="modal">
    <div class="modal-content">
        <h3>利用者一覧</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <thead><tr style="background: #f8f9fa;"><th style="padding: 10px; text-align: left;">ID</th><th style="padding: 10px; text-align: left;">氏名</th><th style="padding: 10px; text-align: left;">住所</th><th style="padding: 10px; text-align: center;">操作</th></tr></thead>
            <tbody id="modal-client-table-body"></tbody>
        </table>
        <button id="close-client-modal" style="margin-top: 15px; padding: 8px 16px;">閉じる</button>
    </div>
</div>

<div id="record-modal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:2000;">
    <div style="background:white; width:95%; max-width:1000px; margin:2% auto; padding:20px; border-radius:8px; max-height:90vh; overflow-y:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:2px solid #6c757d; padding-bottom:10px;">
            <h2 style="margin:0; font-size:1.2em;">📋 過去記録・バイタル一覧</h2>
            <button type="button" id="close-record-modal" style="background:none; border:none; font-size:1.5em; cursor:pointer;">&times;</button>
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:0.9em;">
            <thead style="background:#f8f9fa; position:sticky; top:0; z-index:10;">
                <tr>
                    <th class="sort-btn" data-type="date" data-col="0" style="border:1px solid #ddd; padding:10px; width:120px; cursor:pointer;">日時 ↕</th>
                    <th style="border:1px solid #ddd; padding:10px; width:150px;">利用者</th>
                    <th style="border:1px solid #ddd; padding:10px; width:100px;">記録者</th>
                    <th class="sort-btn" data-type="number" data-col="3" style="border:1px solid #ddd; padding:10px; width:70px; cursor:pointer;">体温 ↕</th>
                    <th class="sort-btn" data-type="number" data-col="4" style="border:1px solid #ddd; padding:10px; width:90px; cursor:pointer;">血圧(上) ↕</th>
                    <th class="sort-btn" data-type="number" data-col="5" style="border:1px solid #ddd; padding:10px; width:70px; cursor:pointer;">水分 ↕</th>
                    <th style="border:1px solid #ddd; padding:10px;">内容</th>
                    <th style="border:1px solid #ddd; padding:10px; width:70px;">操作</th>
                </tr>
                <tr style="background:#eee;">
                    <th style="padding:5px; font-size:0.7em;">
                        <input type="date" id="filter-date-start" class="range-filter" style="width:100%; margin-bottom:2px;"><br>
                        <input type="date" id="filter-date-end" class="range-filter" style="width:100%;">
                    </th>
                    <th style="padding:5px;"><input type="text" class="record-filter" data-col="1" placeholder="氏名..." style="width:100%;"></th>
                    <th style="padding:5px;"><select id="filter-staff-select" class="record-filter" data-col="2" style="width:100%;"><option value="">全員</option></select></th>
                    <th style="padding:5px;"><input type="text" class="record-filter" data-col="3" placeholder="体温..." style="width:100%;"></th>
                    <th style="padding:5px;"><input type="text" class="record-filter" data-col="4" placeholder="血圧..." style="width:100%;"></th>
                    <th style="padding:5px;"><input type="text" class="record-filter" data-col="5" placeholder="水分..." style="width:100%;"></th>
                    <th style="padding:5px;"><input type="text" class="record-filter" data-col="6" placeholder="内容..." style="width:100%;"></th>
                    <th style="background:#ddd;"></th>
                </tr>
            </thead>
            <tbody id="modal-record-table-body"></tbody>
        </table>
    </div>
</div>