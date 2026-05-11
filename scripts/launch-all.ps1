# Start API + admin + user + driver dev servers (from repo root).
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
npm run dev:all
