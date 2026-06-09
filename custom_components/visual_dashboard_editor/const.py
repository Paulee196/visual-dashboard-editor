"""Constants for Visual Dashboard Editor."""

DOMAIN = "visual_dashboard_editor"
VERSION = "0.3.10"

PANEL_ELEMENT = "visual-dashboard-editor-panel-v31"
PANEL_TITLE = "Visual Dashboard Editor"
PANEL_ICON = "mdi:vector-square-edit"
PANEL_URL = "visual-dashboard-editor"

STATIC_URL = f"/{DOMAIN}_static"

WS_LIST_FILES = f"{DOMAIN}/list_files"
WS_LOAD_FILE = f"{DOMAIN}/load_file"
WS_SAVE_ELEMENT = f"{DOMAIN}/save_element"
WS_ADD_ELEMENT = f"{DOMAIN}/add_element"
WS_DELETE_ELEMENT = f"{DOMAIN}/delete_element"
WS_RESTORE_ELEMENT = f"{DOMAIN}/restore_element"

LOVELACE_PATH_PREFIX = "lovelace://"
