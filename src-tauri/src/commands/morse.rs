use sqlx::SqlitePool;
use tauri::State;

#[tauri::command]
pub async fn get_chars(pool: State<'_, SqlitePool>) -> Result<String, String> {
    let result = sqlx::query(r#"SELECT * FROM "international-morse""#)
        .fetch_all(pool.inner())
        .await
        .map_err(|e| e.to_string())?;

    println!("{:#?}", result);

    Ok(String::new())
}

// todo: change to 'convert', take 'direction' enum specifying the conversion direction
#[tauri::command]
pub async fn convert_from_morse(
    input: &str,
    pool: State<'_, SqlitePool>,
) -> Result<String, String> {
    let mut output = String::new();

    for token in input.split(' ').collect::<Vec<&str>>() {
        println!("{}", token);

        if token == "/" {
            output.push(' ');
        } else {
            let result = sqlx::query_scalar::<_, String>(
                r#"SELECT char FROM "international-morse" WHERE code = ?"#,
            )
            .bind(token)
            .fetch_optional(pool.inner())
            .await
            .map_err(|e| e.to_string())?;

            match result {
                Some(character) => output.push_str(&character),
                None => output.push('?'),
            }
        }
    }

    Ok(output)
}
