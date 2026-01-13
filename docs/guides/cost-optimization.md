# Cloud Functions Cost Optimization Guide

## Implemented Optimizations

### 1. Memory Allocation

- **sendOTPEmail**: 256MB → 128MB (50% cost reduction per invocation)
- **verifyOTPEmail**: 256MB → 128MB (50% cost reduction per invocation)
- **health**: Default → 128MB (50% cost reduction per invocation)
- **cleanupExpiredRegistrations**: Default → 256MB (needs more for batch operations)

### 2. Timeout Settings

- **sendOTPEmail**: 30s (prevents hanging invocations)
- **verifyOTPEmail**: 30s
- **health**: 10s
- **cleanupExpiredRegistrations**: 120s (batch operations need more time)

### 3. Query Optimization

- **Before**: Cleanup function scanned entire `mail` collection
- **After**: Uses targeted queries with `where('to', '==', email)` per expired email
- **Impact**: Reduces read operations dramatically (only reads matching documents)

### 4. Max Instances Limit

- Set to 10 instances globally
- Prevents runaway costs from unexpected traffic spikes

## Additional Recommendations

### 5. Firestore Indexes

Ensure these indexes exist (check Firebase Console):

```
Collection: pending_registrations
- createdAt (ascending)

Collection: mail
- delivery.startTime (ascending)
- to (ascending)
```

### 6. Monitoring & Alerts

Set up billing alerts in Firebase Console:

- Alert at 50% of budget
- Alert at 80% of budget
- Hard limit at 100% of budget

### 7. Cold Start Optimization

Current cold start optimizations:

- Minimal dependencies (only firebase-admin, firebase-functions, bcryptjs)
- No heavy libraries
- Functions are focused and lightweight

### 8. Future Optimizations

#### Move to Scheduled Cleanup (Every 6 hours instead of 1 hour)

```typescript
// If registration volume is low:
schedule: 'every 6 hours' // Reduces scheduler invocations by 83%
```

#### Implement Firestore TTL (Time To Live)

When available in your region, use Firestore TTL policies:

- Auto-delete `pending_registrations` after 1 hour
- Auto-delete `mail` after 1 hour
- Eliminates need for cleanup function entirely

#### Consider Firebase Extensions

- Already using: "Trigger Email from Firestore" (efficient)

## Cleanup Function Cost Analysis

### Every 1 Hour Schedule

**Invocations per month:**

- 24 hours/day × 30 days = **720 invocations/month**

**Configuration:**

- Memory: 256MB (0.25 GB)
- CPU: 0.167 GHz (allocated with 256MB)
- Average execution: ~2-3 seconds (batch deletes are fast)

**Pricing (South America East 1):**

- Invocations: First 2M free → **$0** (well within free tier)
- Compute time: First 400,000 GHz-seconds free
  - GHz-seconds used: 0.167 GHz × 2.5s avg × 720 = ~300 GHz-seconds/month
  - **$0** (within free tier)

### Firestore Operations Cost

This is where the actual cost comes from:

**Per cleanup run (assuming 10 expired registrations/hour):**

- 1 query on `pending_registrations` = 1 read (even if 0 results)
- 10 document reads from query results = 10 reads
- 10 deletes = 10 deletes
- 1 query on `mail` collection = 1 read
- ~10 mail document reads = 10 reads
- ~10 mail deletes = 10 deletes

**Total per run:** ~32 reads, ~20 deletes

**Monthly (720 runs):**

- Reads: 32 × 720 = **23,040 reads/month** = $0.092
- Deletes: 20 × 720 = **14,400 deletes/month** = $0.026

### **Total Cleanup Cost: ~$0.12/month**

However, if you have fewer expired registrations (more realistic scenario with 2-3/hour):

- Reads: ~10 × 720 = 7,200 = **$0.029**
- Deletes: ~6 × 720 = 4,320 = **$0.008**
- **Total: ~$0.04/month**

## Cost Comparison: Every 1 Hour vs Every 6 Hours

| Schedule      | Runs/Month | Compute Cost | Firestore Cost | Total          |
| ------------- | ---------- | ------------ | -------------- | -------------- |
| Every 1 hour  | 720        | $0           | $0.04-0.12     | **$0.04-0.12** |
| Every 6 hours | 120        | $0           | $0.04-0.12\*   | **$0.04-0.12** |

\*Same Firestore cost because you still process the same total expired documents, just in larger batches

## Verdict: Keep Every 1 Hour ✅

**Reasons:**

1. **Compute cost is $0** (free tier covers it completely)
2. **Firestore cost is the same** regardless of frequency
3. **Benefit of 1 hour:** Keeps database cleaner in real-time
4. **Cost difference:** None

The main cost is Firestore operations, which depends on document volume, not frequency. Since you're well within compute free tier, there's **no reason to reduce from 1 hour to 6 hours**.

**Actual monthly cost for cleanup at current scale: ~$0.04-0.12**

## Monitoring Commands

```bash
# View function logs
firebase functions:log

# View specific function
firebase functions:log --only sendOTPEmail

# Check function execution stats
firebase projects:list
```

## Best Practices

1. **Test locally first**: Use Firebase Emulators

   ```bash
   npm run serve
   ```

2. **Monitor cold starts**: Check Cloud Functions logs for execution time

3. **Review monthly bills**: Firebase Console → Usage and billing

4. **Delete unused functions**: Don't leave test functions deployed

5. **Use batch operations**: Already implemented for cleanup

6. **Early returns**: Validate input early to avoid unnecessary operations

## Current Efficiency

✅ All functions use minimal memory
✅ Timeouts prevent hanging invocations
✅ Queries are indexed and optimized
✅ Batch operations for bulk deletes
✅ Early validation to fail fast
✅ Scheduled cleanup instead of real-time triggers
✅ Max instances cap prevents cost spikes

## Trade-offs Made

1. **Lower Memory**: Acceptable because functions don't process large data
2. **Shorter Timeouts**: Acceptable because operations are fast
3. **Scheduled Cleanup**: 1-hour delay acceptable vs real-time cleanup cost
4. **Max Instances**: May queue requests during extreme spikes (acceptable trade-off)

## Next Steps

1. Deploy optimized functions
2. Monitor performance for 1 week
3. Check Firebase Console for any timeout errors
4. Adjust memory if needed (unlikely)
5. Consider moving to 6-hour cleanup schedule if volume is low
