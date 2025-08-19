#!/bin/sh

set -e

allowed_keys="APILLON_API_KEY APILLON_API_SECRET APILLON_WEBSITE_UUID"

while IFS= read -r line || [ -n "$line" ]; do
  # Skip empty lines and full-line comments
  case "$line" in
    ''|\#*) continue ;;
  esac

  key="${line%%=*}"
  value="${line#*=}"

  key="$(echo "$key" | xargs)"
  value="$(echo "$value" | xargs)"

  case "$allowed_keys" in
    *"$key"*)
      # Keep original value untouched and export safely
      eval "export $key=$value"
      ;;
  esac
done < .env
