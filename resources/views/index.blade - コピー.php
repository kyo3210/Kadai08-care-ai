<!DOCTYPE html>
<html lang="ja">
<head>
    @include('parts.head')
    <style>
        /* タブ切り替え用の表示制御 */
        .content-section { display: none; width: 100%; }
        .content-section.active { display: block; }
        
        /* サイドメニューの追加スタイル */
        .menu-item.selected { background: #0056b3; font-weight: bold; }
        
        /* メインの余白調整 */
        main { padding: 10px; max-width: 1200px; margin: 0 auto; }
        
        /* 初期画面設定のバー */
        .settings-bar { background: #e9ecef; padding: 5px 15px; display: flex; align-items: center; gap: 10px; font-size: 0.8em; }
    </style>
</head>
<body style="background: #f4f7f6; font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0;">

    <div class="settings-bar">
        <span>初期画面設定:</span>
        <select id="start-page-setting" onchange="saveStartPageSetting(this.value)" style="width: auto; padding: 2px;">
            <option value="dashboard">分析ダッシュボード</option>
            <option value="schedule">本日のスケジュール</option>
        </select>
    </div>

    <div id="sidebar-overlay"></div>
    <nav id="sidebar">
        <div style="padding: 20px; border-bottom: 1px solid #495057;">
            <p style="font-size: 0.8em; color: #adb5bd; margin: 0;">CareSupport メニュー</p>
        </div>
        <a class="menu-item active" onclick="showTab('dashboard')">🏠 ダッシュボード</a>
        <a class="menu-item" onclick="showTab('schedule')">📅 スケジュール管理</a>
        <a class="menu-item" onclick="showTab('chat')">💬 AIチャット相談</a>
        <a class="menu-item" onclick="showTab('vital')">📊 バイタル分析</a>
        <a class="menu-item" onclick="showTab('record')">📝 ケア記録入力</a>
        <a class="menu-item" onclick="showTab('client')">👤 利用者管理</a>
        <a class="menu-item" onclick="showTab('office')">🏢 事業者情報</a>
    </nav>

    <header style="background: #fff; display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 2px solid #0056b3; position: sticky; top: 0; z-index: 100;">
        <div style="display: flex; align-items: center; gap: 15px;">
            <button id="menu-toggle" style="background:none; border:none; color:#0056b3; font-size:1.8em; cursor:pointer;">☰</button>
            <h1 id="page-title" style="color: #0056b3; margin: 0; font-size: 1.1em;">ダッシュボード</h1>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 0.8em; color: #666;">{{ Auth::user()->name }}</span>
            <form method="POST" action="{{ route('logout') }}" style="margin: 0;">
                @csrf
                <button type="submit" style="background: #6c757d; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.7em;">終了</button>
            </form>
        </div>
    </header>

    <main>
        {{-- 1. ダッシュボード (重複ID対策として、個別のincludeではなくdashboard専用の構造を維持) --}}
        <div id="tab-dashboard" class="content-section active">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                <section style="border-top: 4px solid #ffc107;">
                    <h3 style="font-size: 1em; margin-top: 0;">📅 本日のスケジュール</h3>
                    <div id="dashboard-schedule-list">
                        <p style="color: #999; padding: 10px;">読み込み中...</p>
                    </div>
                    <button onclick="showTab('schedule')" style="width: 100%; background: #f8f9fa; border: 1px solid #ddd; padding: 5px; cursor: pointer; font-size: 0.8em; margin-top: 10px;">カレンダーで詳細を見る</button>
                </section>

                <section style="border-top: 4px solid #dc3545;">
                    <h3 style="font-size: 1em; margin-top: 0;">⚠️ 要注意バイタル</h3>
                    <div id="dash-vital-alert"><p style="padding: 10px; color: #666;">現在、異常値の報告はありません。</p></div>
                    <button onclick="showTab('vital')" style="width: 100%; background: #f8f9fa; border: 1px solid #ddd; padding: 5px; cursor: pointer; font-size: 0.8em; margin-top: 10px;">詳細グラフへ</button>
                </section>

                @include('parts.chat')
                @include('parts.vital')
            </div>
        </div>

        {{-- 各タブセクション --}}
        <div id="tab-schedule" class="content-section">@include('parts.schedule')</div>
        <div id="tab-chat" class="content-section">@include('parts.chat')</div>
        <div id="tab-vital" class="content-section">@include('parts.vital')</div>
        <div id="tab-record" class="content-section">@include('parts.record')</div>
        <div id="tab-client" class="content-section">@include('parts.client')</div>
        <div id="tab-office" class="content-section">@include('parts.office')</div>
    </main>

    @include('parts.modals')

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script>
        // --- 基本UI操作ロジック ---

        function toggleSidebar() {
            $('#sidebar, #sidebar-overlay').toggleClass('active');
        }

        function showTab(tabName) {
            $('.content-section').removeClass('active');
            $('#tab-' + tabName).addClass('active');
            
            const titles = {
                'dashboard': 'ダッシュボード', 'schedule': 'スケジュール管理',
                'chat': 'AIチャット相談', 'vital': 'バイタル分析',
                'record': 'ケア記録入力', 'client': '利用者管理', 'office': '事業者情報'
            };
            $('#page-title').text(titles[tabName] || 'CareSupport AI');

            if($('#sidebar').hasClass('active')) toggleSidebar();
            window.scrollTo(0, 0);

            if (tabName === 'schedule' && typeof calendar !== 'undefined') {
                setTimeout(() => { calendar.updateSize(); }, 100);
            }
        }

        function saveStartPageSetting(value) {
            localStorage.setItem('care_support_start_page', value);
        }

        $(document).ready(function() {
            // ハンバーガーメニュークリックイベント
            $(document).on('click', '#menu-toggle, #sidebar-overlay', function(e) {
                e.preventDefault();
                toggleSidebar();
            });

            // 初期タブ表示
            const savedPage = localStorage.getItem('care_support_start_page') || $('#start-page-setting').val();
            if (savedPage) {
                $('#start-page-setting').val(savedPage);
                showTab(savedPage);
            }
        });
    </script>

    <script src="{{ asset('js/ai-chat.js') }}"></script>
    <script src="{{ asset('js/vital-analysis.js') }}"></script>
    <script src="{{ asset('js/schedule-record.js') }}"></script>
    <script src="{{ asset('js/management.js') }}"></script>    
</body>
</html>