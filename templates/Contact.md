---
type: contact
name: null
role: null
company: null
context: null
tags: [contact]
---

# 👤 `= this.name`

> `= this.role` @ `= this.company` | Contexte : `= this.context`

---

## 📝 Notes

>

---

## 🔗 Interactions récentes

```dataview
LIST
FROM "02 - Areas/Pro/Meetings" OR "02 - Areas/Pro/1on1"
WHERE contains(attendees, this.name)
SORT date DESC
LIMIT 5
```
