"""Config flow for Visual Dashboard Editor."""

from __future__ import annotations

from homeassistant import config_entries

from .const import DOMAIN


class VisualDashboardEditorConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Visual Dashboard Editor."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Create the single editor entry."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        return self.async_create_entry(title="Visual Dashboard Editor", data={})
