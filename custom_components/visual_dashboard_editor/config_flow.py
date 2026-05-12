"""Config flow for Visual Dashboard Editor."""

from __future__ import annotations

from homeassistant import config_entries
from homeassistant.config_entries import ConfigFlowResult

import voluptuous as vol

from .const import DOMAIN


class VisualDashboardEditorConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Visual Dashboard Editor."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict | None = None
    ) -> ConfigFlowResult:
        """Create the single editor entry."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is None:
            return self.async_show_form(
                step_id="user",
                data_schema=vol.Schema({}),
                errors={},
            )

        return self.async_create_entry(title="Visual Dashboard Editor", data={})
