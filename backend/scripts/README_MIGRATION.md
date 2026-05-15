# Advisory Data Migration Instructions

This guide provides step-by-step instructions for migrating advisory data from the `advisories` collection to the new database structure with separate `advisories` (reference data) and `useradvisories` (user-specific data) collections.

## Prerequisites

- MongoDB running (localhost:27017 or as configured in .env)
- Node.js installed
- Access to run scripts in the project directory

## Migration Steps

### 1. Backup Your Database (IMPORTANT!)

Before starting any migration, create a backup of your MongoDB database:

```bash
# Create a backup directory with today's date
mkdir -p ./db-backups/$(date +%Y-%m-%d)

# Run mongodump
mongodump --db agroverse --out ./db-backups/$(date +%Y-%m-%d)
```

### 2. Install Dependencies

Make sure all dependencies are installed:

```bash
cd /path/to/Agroverse/backend
npm install
```

### 3. Run the Migration Script

The migration script will move user-specific advisories to the new collection:

```bash
# Navigate to the backend directory
cd /path/to/Agroverse/backend

# Run the migration script
node scripts/migrateAdvisories.js
```

This script will:
- Find all user-specific advisories in the original `advisories` collection
- Create corresponding records in the new `useradvisories` collection
- Display a summary of migrated records

### 4. Verify Migration Success

Check that both collections have the expected data:

```bash
# Start MongoDB shell
mongo

# Switch to the agroverse database
use agroverse

# Count documents in each collection
db.advisories.countDocuments()  # Should contain both pre-defined and user data at this point
db.useradvisories.countDocuments()  # Should contain user-specific advisories

# View sample data from each collection
db.advisories.findOne()
db.useradvisories.findOne()
```

### 5. Clean Up Original Collection (Optional but Recommended)

Once you've verified the migration was successful, you can clean up the original collection:

```bash
# Run the cleanup script
node scripts/cleanupAfterMigration.js
```

This script will:
- Ask for confirmation before proceeding
- Remove only user-specific advisories from the original collection
- Keep any pre-defined data in place

### 6. Seed Pre-defined Advisory Data

After successful migration and cleanup, seed the reference data:

```bash
# Run the seeding script for pre-defined advisories
node scripts/seedPredefinedAdvisories.js
```

This will:
- Check if cleanup is complete (no user advisories left in original collection)
- Clear any existing pre-defined advisories
- Populate the `advisories` collection with standardized reference data

### 7. Restart Your Server

Restart the backend server to apply the changes:

```bash
# If using nodemon or similar
npm run dev

# Or if using Node directly
node server.js
```

## Complete Migration Workflow

For a smooth migration, execute the scripts in this order:

1. `node scripts/migrateAdvisories.js` - Migrate user data to new collection
2. Verify data integrity in both collections
3. `node scripts/cleanupAfterMigration.js` - Clean up original collection
4. `node scripts/seedPredefinedAdvisories.js` - Seed pre-defined data

## Troubleshooting

### If Migration Fails

1. Check the error message for details on what went wrong
2. Fix any issues (database connection, permissions, etc.)
3. Restore from backup if needed:
   ```bash
   mongorestore --db agroverse ./db-backups/YYYY-MM-DD/agroverse
   ```
4. Try running the migration again

### Common Issues

- **Connection errors**: Verify MongoDB is running and connection string is correct
- **Permission errors**: Ensure your MongoDB user has write access to both collections
- **Duplicate keys**: Check if migration was partially completed before

## Rollback Plan

If you need to revert to the previous structure:

1. Drop the new `useradvisories` collection:
   ```
   db.useradvisories.drop()
   ```

2. Restore the original data from backup:
   ```bash
   mongorestore --db agroverse ./db-backups/YYYY-MM-DD/agroverse
   ```

3. Switch back to the previous codebase version (without UserAdvisory model) 