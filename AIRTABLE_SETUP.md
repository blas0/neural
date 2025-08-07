# Airtable Setup Instructions

This document explains the Airtable integration for the booking form.

## ✅ Your Airtable Configuration

**Base ID:** `app8vyUe1sr8A2QlS`
**Table ID:** `tblGAQ6b4C2v7JfW8`
**API Key:** Configured and working

## 📋 Verified Field Mapping

Your Airtable table has been analyzed and the integration configured with these working fields:

### ✅ Working Fields (Verified):

| Form Field | Airtable Field Name | Status | Description |
|------------|---------------------|--------|-------------|
| First Name | `First Name` | ✅ Active | Required contact field |
| Last Name | `Last Name` | ✅ Active | Required contact field |
| Email | `Email` | ✅ Active | Required email address |
| Phone | `Phone Number` | ✅ Active | Required phone number |
| Website | `Website` | ✅ Active | Optional website URL |
| Tier | `Tier` | ✅ Active | Project tier selection |
| Project Details | `Project Details` | ✅ Active | Optional project description |

### 📝 Form Data Not Stored in Airtable:

The form captures additional metadata that is not stored in Airtable:
- **Source**: Traffic source tracking (not stored)  
- **Status**: Lead status (not in your table structure)
- **Metadata**: IP hash, user agent, timestamps (not stored)

**Note:** All form data including contact information (name, email, phone, website, tier) and project details are now saved to your Airtable. Only metadata like source tracking and IP information is not stored.

### Field Configuration Details:

#### Tier Field (Single Select)
- `tier-1` (Essential - $500+)
- `tier-2` (Professional - $1000+) 
- `tier-3` (Enterprise - Custom)

#### Status Field (Single Select)
- `New` (default for new submissions)
- `Contacted` (when you reach out)
- `Qualified` (potential client)
- `Closed` (completed/rejected)

## 3. Get API Credentials

1. Go to [Airtable API Documentation](https://airtable.com/api)
2. Select your base to get the Base ID
3. Generate a Personal Access Token with the following scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`

## 4. Environment Variables

Create a `.env` file in your project root with:

```env
AIRTABLE_API_KEY=your_personal_access_token
AIRTABLE_BASE_ID=your_base_id
HASH_SALT=your_random_salt_string
NODE_ENV=production
```

## 5. Vercel Deployment

Add these environment variables to your Vercel project:

```bash
vercel env add AIRTABLE_API_KEY
vercel env add AIRTABLE_BASE_ID
vercel env add HASH_SALT
vercel env add NODE_ENV
```

## 6. Testing

1. Deploy to Vercel or run locally with `npm run dev`
2. Submit a test form
3. Check your Airtable base for the submission
4. Verify all fields are populated correctly

## 7. Optional: Create Views

Create these views in Airtable for better organization:

- **All Submissions** - Default view with all records
- **New Leads** - Filter: Status = "New"
- **By Tier** - Group by: Tier
- **This Week** - Filter: Submission Date is within 1 week
- **High Value** - Filter: Tier = "tier-3" OR Tier = "tier-2"

## Security Features

The integration includes:

- Rate limiting (5 submissions per IP per 15 minutes)
- Email rate limiting (3 submissions per email per day)
- Honeypot spam detection
- Content filtering for spam keywords
- IP address hashing for privacy
- Input sanitization and validation

## Troubleshooting

### Common Issues:

1. **403 Forbidden**: Check API key permissions and scopes
2. **404 Not Found**: Verify base ID and table name
3. **422 Validation Error**: Check field names match exactly
4. **Rate Limited**: Normal behavior, indicates security is working

### Debug Steps:

1. Check Vercel function logs
2. Verify environment variables are set
3. Test API credentials with Airtable API documentation
4. Ensure table structure matches expected fields