use sqlx::{SqlitePool, sqlite::SqlitePoolOptions};
use tauri::path::BaseDirectory;
use tauri::{AppHandle, Manager};
use tauri_plugin_fs::FsExt;

// Read a SQLite database from a given path
pub async fn initialize(app: &AppHandle, path: &'static str) -> Result<SqlitePool, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;

    let db_path = app_dir.join(path);

    if !db_path.exists() {
        let resource_path = app
            .path()
            .resolve(path, BaseDirectory::Resource)
            .map_err(|e| e.to_string())?;

        let contents = app
            .fs()
            .read(&resource_path)
            .map_err(|e| format!("Resource read failed: {}", e))?;

        std::fs::write(&db_path, contents).map_err(|e| format!("Database copy failed: {}", e))?;
    }

    let connection_string = format!("sqlite://{}", db_path.to_string_lossy());

    let pool = SqlitePoolOptions::new()
        .max_connections(3)
        .connect(&connection_string)
        .await
        .map_err(|e| e.to_string())?;

    Ok(pool)
}
