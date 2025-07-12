#!/bin/bash

# Newsletter Processing Cron Job
# Run this script periodically (e.g., every 5 minutes) to process pending newsletter subscriptions
# Add to crontab: */5 * * * * /path/to/newsletter-cron.sh

cd "$(dirname "$0")/.."
/usr/local/bin/npx tsx scripts/process-newsletter-queue.ts >> logs/newsletter-cron.log 2>&1