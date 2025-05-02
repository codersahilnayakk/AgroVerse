# Advisory Data Restructuring Guide

## Overview

We've restructured the Advisory feature to separate pre-defined reference data from user-generated advisory recommendations. This change:

1. Keeps pre-defined data in the original `advisories` collection
2. Stores user-generated recommendations in a new `useradvisories` collection
3. Enables proper data separation while maintaining all functionality

## Database Collections

- **advisories**: Contains only pre-defined reference data (soil types, crop recommendations, etc.)
- **useradvisories**: Contains user-generated advisory recommendations with links to the user

## Migration Process

If you're upgrading from a previous version, follow these steps to migrate your data:

### Step 1: Back Up Your Database

Always create a backup before performing migrations:

```bash
mongodump --db agriconnect --out ./backup-$(date +%Y%m%d)
```

### Step 2: Run the Migration Script

```bash
node scripts/migrateAdvisories.js
```

This script:
- Identifies all user-specific advisories in the original collection
- Migrates them to the new `useradvisories` collection
- Provides a summary of migrated records

### Step 3: Seed Pre-defined Advisory Data

After migration is complete, run:

```bash
node scripts/seedPredefinedAdvisories.js
```

This script:
- Clears existing pre-defined advisories (checks if migration completed first)
- Seeds the `advisories` collection with standardized reference data

## API Changes

The API endpoints remain unchanged, but now they operate on different collections:

- `GET /api/advisory/combinations` - Gets combinations from pre-defined advisories
- `POST /api/advisory` - Creates user-specific advisories in the useradvisories collection
- `GET /api/advisory` - Gets user-specific advisories from the useradvisories collection
- `GET /api/advisory/:id` - Gets a specific user advisory from useradvisories
- `DELETE /api/advisory/:id` - Deletes a user advisory from useradvisories

## Technical Details

### Models

- **advisoryModel.js**: Original model, now used only for pre-defined data
- **userAdvisoryModel.js**: New model for user-generated advisories

### Controller Changes

The `advisoryController.js` now:
1. Uses pre-defined data as templates from the advisories collection
2. Creates and retrieves user data from the useradvisories collection
3. Maintains backward compatibility with frontends

### Additional Changes

- Added optional `baseAdvisoryId` to userAdvisoryModel to track which pre-defined advisory was used as a template
- Included new migration endpoint at `POST /api/advisory/migrate` (admin only)

## Troubleshooting

If you encounter issues during migration:

1. Check MongoDB logs for errors
2. Verify both collections exist: `advisories` and `useradvisories`
3. Ensure database user has proper permissions for both collections
4. If data appears missing, check query filters to ensure they target the correct collection 