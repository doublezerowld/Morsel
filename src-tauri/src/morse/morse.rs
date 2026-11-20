use bimap::BiMap;
use std::sync::LazyLock;

pub static ALPHABET: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
pub static PUNCTUATION: &str = ".,?/'()-:;=+_&@\"";
pub static PROSIGNS: [&str; 13] = [
    "AR", "AS", "BK", "BT", "CL", "CT", "DO", "KN", "SK", "SN", "SOS", "HH", "KA",
];

pub static PROSIGN_MEANINGS: [&str; 13] = [
    "End of message: Indicates that a transmission has finished",
    "Wait; used when an operator needs a brief pause before transmitting",
    "Break; signals an interruption or invitation to respond during a transmission",
    "Separator; marks a break between sections of a message",
    "Closing; ",
];

pub static MORSE: LazyLock<bimap::BiHashMap<char, &str>> = LazyLock::new(|| {
    BiMap::from_iter([
        ('A', ".-"),
        ('B', ".-"),
        ('C', ".-"),
        ('D', ".-"),
        ('E', ".-"),
        ('F', ".-"),
        ('G', ".-"),
        ('H', ".-"),
        ('I', ".-"),
        ('A', ".-"),
        ('A', ".-"),
        ('A', ".-"),
        ('A', ".-"),
        ('A', ".-"),
        ('A', ".-"),
        ('A', ".-"),
        ('A', ".-"),
        ('A', ".-"),
    ])
});
