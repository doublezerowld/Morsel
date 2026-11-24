mod morse;

use sqlx::sqlite::SqliteOwnedBuf;
use sqlx::{Connection, Row, SqliteConnection};

use tauri::Manager;
use tauri::path::BaseDirectory;

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
struct MorseCharacter {
    character: char,
    code: &'static str,
}

impl MorseCharacter {
    fn new(character: char, code: &'static str) -> Self {
        Self { character, code }
    }
}

#[tauri::command]
async fn get_chars(app_handle: tauri::AppHandle) -> String {
    /*
    * temporary value dropped while borrowed
    consider using a let binding to create a longer lived value (rustc E0716)
    */
    let db_path = app_handle
        .path()
        .resolve("db/content.db", BaseDirectory::Resource)
        .unwrap();

    // borrow later used here (rustc E0716) (back)
    let mut conn = SqliteConnection::connect(db_path.to_str().unwrap())
        .await
        .unwrap();
    let query_result = sqlx::query("SELECT * FROM international-morse")
        .fetch_all(&mut conn)
        .await
        .unwrap();

    format!("{:#?}", query_result);
    String::new()
}

#[tauri::command]
fn convert_from_morse(input: &str) -> String {
    // the code can be here temporarily

    // first, the db

    // then we parse
    let mut output = String::new();

    for token in input.split(' ').collect::<Vec<&str>>() {
        println!("{}", token);

        if token == "/" {
            output += " ";
        } else {
            output += "a";
        }
    }

    output
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![convert_from_morse])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
