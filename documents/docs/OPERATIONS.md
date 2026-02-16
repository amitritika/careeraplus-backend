# Operations (Runbook)

## Start
```
npm run dev
```

## Health check (optional)
```js
app.get('/api/ping', (req,res)=> res.json({ ok: true, time: new Date().toISOString() }));
```

## Common issues
- 401 on protected routes → cookie missing/invalid
- `Cast to string failed` → normalize form-data fields
- Mongoose callback errors → use async/await
