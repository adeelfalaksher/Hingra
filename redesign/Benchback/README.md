# Benchback redesign

This branch records the replacement product plan requested after review of Hingra.

Benchback is a planned spatial repair ledger: user-marked source/tray locations, recorded part quantities, reverse-order return guidance, and reversible reconciliation. It has not been implemented or tested yet. Old Hingra test results do not validate Benchback.

Lens Studio 5.24.1.26100516 is installed, and a fresh native Benchback project has been saved. Its MCP connection works. The required Lens Studio account check currently reports signed out; implementation is awaiting the user sign-in step. SPECS target and package initialization remain pending.

The existing main branch remains unchanged until the replacement is working. The native code at this branch root is still Hingra, not Benchback. Do not present it as the redesigned experience.

- [Design brief](design-brief.md)
- [Research and challenge review](research-and-scope.md)
- [Build plan](build-plan.json)
- [Test plan](test-plan.md)
