<section id="chat-section">
    <h2 style="font-size: 1.1em; margin-bottom: 10px;">💬 AIチャット相談</h2>

    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; font-size: 0.85em; background: #f8f9fa; padding: 10px; border-radius: 8px; border: 1px solid #eee;">
        <span style="font-weight: bold; color: #555;">🔊 AI回答の音声読み上げ</span>
        <label class="switch" style="cursor: pointer;">
            <input type="checkbox" id="voice-read-toggle" style="display: none;">
            
            <div id="toggle-bg" style="width: 44px; height: 22px; background: #ccc; border-radius: 11px; position: relative; transition: 0.3s;">
                <div id="toggle-circle" style="width: 18px; height: 18px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
            </div>
        </label>
    </div>

    <div style="margin-bottom: 10px;">
        <select id="client-select" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
            <option value="">利用者を選択してください</option>
        </select>
    </div>

    <div id="chat-window" style="height: 400px; overflow-y: auto; background: #fafafa; border: 1px solid #eee; padding: 15px; margin-bottom: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 10px;">
        </div>

    <form id="chat-form" style="display: flex; gap: 8px;">
        <button type="button" id="voice-input-btn" style="background: #007bff; color: white; border: none; padding: 0 12px; border-radius: 6px; cursor: pointer; min-width: 44px;">🎤</button>
        
        <input type="text" id="user-input" placeholder="主任に相談..." required style="flex-grow: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
        
        <button type="submit" style="background: #28a745; color: white; border: none; padding: 0 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">送信</button>
        
        <button type="button" id="chat-clear-btn" style="background: #dc3545; color: white; border: none; padding: 0 12px; border-radius: 6px; cursor: pointer; font-size: 0.8em;">クリア</button>
    </form>
</section>

<style>
    /* チャットウィンドウ内のスクロールバーを綺麗にする */
    #chat-window::-webkit-scrollbar {
        width: 6px;
    }
    #chat-window::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    #chat-window::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
    }
    #chat-window::-webkit-scrollbar-thumb:hover {
        background: #bbb;
    }

    /* メッセージの基本スタイル（script.jsのappendMessageと連動） */
    .user-message, .ai-message {
        max-width: 85%;
        word-wrap: break-word;
    }
</style>