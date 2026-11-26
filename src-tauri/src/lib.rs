mod commands;
mod db;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();

            tauri::async_runtime::block_on(async move {
                let pool = db::initialize(&handle, "knowledge.db")
                    .await
                    .expect("Failed to initialize database");

                handle.manage(pool);
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::morse::get_chars,
            commands::morse::convert_from_morse,
        ])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!()) // OUT_DIR env var is not set, do you have a build script? (rust-analyzer macro-error)
        .expect("error while running tauri application");
}
