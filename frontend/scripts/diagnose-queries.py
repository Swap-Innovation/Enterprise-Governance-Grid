import json
import urllib.request

base = "http://127.0.0.1:8787"

def get(path):
    with urllib.request.urlopen(base + path, timeout=30) as r:
        return json.load(r)

def run(qid, params=None):
    body = json.dumps({"queryId": qid, "params": params or {}}).encode()
    req = urllib.request.Request(
        base + "/api/kg/queries/run",
        data=body,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return json.load(r)
    except Exception as e:
        try:
            err_body = e.read().decode()  # type: ignore[attr-defined]
            return json.loads(err_body)
        except Exception:
            return {"error": str(e)}

health = get("/api/kg/health")
print("health", health)
cats = get("/api/kg/queries")
for q in cats["queries"]:
    params = {}
    if q["code"] == "Q2":
        params = {"natco": "natco-de"}
    if q["code"] == "Q3":
        params = {"productId": "dp-customer-360"}
    j = run(q["id"], params)
    err = j.get("error")
    types = {}
    for n in j.get("nodes") or []:
        t = n.get("type") or "?"
        types[t] = types.get(t, 0) + 1
    ns = sum(1 for n in (j.get("nodes") or []) if n.get("type") == "namespace")
    prods = [n.get("label") for n in (j.get("nodes") or []) if n.get("type") == "product"]
    print(
        f"{q['code']}: err={err!r} nodes={j.get('nodeCount')} edges={j.get('edgeCount')} "
        f"rows={j.get('rowCount')} namespaces={ns} products={prods[:8]} types={types}"
    )
