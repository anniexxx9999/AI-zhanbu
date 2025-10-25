#!/bin/bash
cd "$(dirname "$0")"
export PROKERALA_CLIENT_ID="56cf2183-780f-44de-9e97-d36367463cef"
export PROKERALA_CLIENT_SECRET="2qrAahRuxetrxse7dcP0mgZEtjQoA4WXoN4IpFUk"
export PROKERALA_BASE_URL="https://api.prokerala.com"
node dist/server.js
