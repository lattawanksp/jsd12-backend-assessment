# My Understanding

## Submission Links

**Loom Video (must be set to public — anyone with the link):**
[paste your Loom video URL here]

---

## Questions

Answer each question in your own words. There are no trick questions.

The goal is not a perfect answer — it is an honest one. Write as if you are explaining to a friend who has never used Express. Completing this will prepare you for your video walkthrough.

Do not copy from documentation, your code comments, or AI output. If you are unsure about something, write what you do understand and note where the gap is.

---

**1. What does each HTTP method in your API mean — GET, POST, PUT or PATCH, and DELETE? Why do we use different methods instead of just using POST for everything?**

_Your answer:_
GET = เอาไว้อ่านข้อมูล หรือดึงข้อมูลเพื่อเอามาแสดง
POST = สร้างข้อมูลใหม่ เช่น post status
PUT = แก้ไขข้อมูลทุกส่วน
PATCH = แก้ไขข้อมูลบางส่วน
DELETE = ใช้ลบข้อมูล
เราไม่ใช่ POST เพราะแต่ละ HTTP method ใช้คนละรูปแบบ ทำให้เห็นความหมายชัดเจน อ่าน API ง่ายและเป็นมาตรฐานทั่วไปที่ควรทำ

---

**2. What is `express.json()` and what would happen if you left it out?**

_Your answer:_
express.json() เป็น middleware ที่ใช้แปลงข้อมูล JSON ที่ client ส่งมา ให้กลายเป็น JavaScript object แล้วเอามาเก็บไว้ใน req.body เพื่อให้เอาไปใช้ใน route ได้ง่ายขึ้น
ถ้าไม่ใส่ middleware นี้ เวลา client ส่ง JSON เข้ามาที่ POST หรือ PATCH server จะอ่านข้อมูลจาก req.body ไม่ได้ ทำให้การสร้างหรืออัปเดต product มีปัญหา

---

**3. What is the difference between `req.body`, `req.params`, and `req.query`? Give a real example from your API for each one.**

_Your answer:_
ทั้งสามอย่างต่างกันที่ตำแหน่งของข้อมูลใน request

1. req.body = คือข้อมูลที่ client ส่งมาใน body ของ request มักใช้กับ POST, PUT, PATCH ในโปรเจกต์นี้ใช้ตอนสร้างหรืออัปเดต product ตัวอย่างเช่น POST /products client จะส่ง name, price, quantity มา แล้วเราอ่านจาก req.body
   ตัวอย่าง
   {
   "name": "Monitor",
   "price": 199.99,
   "quantity": 1
   }

2. req.params = ค่าที่อยู่ใน URL path ใช้กับ route parameter เช่น /products/:id ในโปรเจกต์นี้ใช้ตอนหา product ตาม id, อัปเดตตาม id, และลบตาม id เช่นถ้าเรียก /products/2 ค่า req.params.id ก็จะเป็น 2

3. req.query = ค่าที่อยู่ท้าย URL อยู่หลังเครื่องหมาย ?
   มักใช้กับ filter, search, sort ในโปรเจกต์นี้ใช้ใน GET /products?name=mouse
   req.query.name จะได้ค่า "mouse"

---

**4. What are HTTP status codes? List every status code you used in your API and explain why you chose it for that situation.**

_Your answer:_
HTTP status codes คือเลขที่ server ส่งกลับไปบอกผลของ request ช่วยให้คนใช้ API รู้ทันทีว่า request สำเร็จหรือพลาดตรงไหน
status codes ที่ใช้ในโปรเจกต์นี้

1. 200 OK
   ใช้ตอน request สำเร็จ
   GET /products
   GET /products/:id ตอนเจอข้อมูล
   PATCH /products/:id ตอนอัปเดตสำเร็จ
   DELETE /products/:id ตอนลบสำเร็จ
2. 201 Created
   ใช้ตอนสร้างข้อมูลใหม่สำเร็จ
   POST/products
3. 400 Bad Request
   ใช้ตอน client ส่งข้อมูลมาไม่ครบหรือไม่ถูกต้อง
4. 404 Not Found
   ใช้ตอนหา resource ไม่เจอ
   เช่น GET /products/999
   หรือ route ที่ไม่มีอยู่จริง เช่น /hello

---

**5. What is middleware? Describe what it does in your own words and give one example from your code.**

_Your answer:_
middleware คือฟังก์ชันที่ทำงานอยู่ตรงกลาง ระหว่างตอนที่ request เข้ามาที่ server กับตอนที่ response ถูกส่งกลับไป
สามารถจัดการทำอะไรบางอย่างก่อนที่จะส่งไปที่ route ถัดไป
ในโปรเจกต์นี้ใช้ 2 middleware คือ

1. express.json() เป็น middleware ของ Express
2. logger middleware / app.use(...)
   พิมพ์ method และ URL ของ request แล้วเรียก next() เพื่อให้ request ไปต่อ
   ในโปรเจกต์ยังมี error-handling middleware อยู่ท้ายสุดด้วย

---

**6. Why does the order of middleware matter in Express? What could go wrong if it were in the wrong order?**

_Your answer:_
ลำดับของ middleware มีสำคัญเพราะ Express ทำงานจากบนลงล่าง ถ้าวาง middleware ผิดลำดับ บางอย่างอาจไม่ทำงานหรือ request อาจค้างได้
เช่น express.json()ต้องวางก่อน route ที่ใช้req.bodyไม่อย่างนั้น routePOSTและPATCH จะอ่านข้อมูล JSON ไม่ได้
logger middleware ต้องวางไว้ก่อน routes เพื่อให้ log request ได้ทุกครั้ง
error-handling middleware ต้องวางไว้สุดท้าย เพื่อรอรับ error ที่ส่งมาจาก route หรือ middleware ก่อนหน้า
\*\* ถ้าลืมใส่ next() request จะค้าง

---

**7. Walk through what happens on the server, step by step, when a POST request is sent to `/products`.**

_Your answer:_

1. client ส่ง POST /products เข้ามาในรูปแบบ JSON body
2. request ผ่าน express.json() ซึ่งเป็น middleware ที่แปลง JSON ให้กลายเป็น JavaScript object แล้วเก็บใน req.body
3. request ผ่าน logger middleware เอาไว้ log method กับ URL ให้ออกมาใน console เช่น POST /products เอาไว้ดูการทำงานของ server
4. request เข้ามาที่ route app.post("/products", ...)
   ใน route เราจะดึง name, price, quantity ออกจาก req.body
5. server ตรวจสอบข้อมูล
   ถ้าข้อมูลไม่ถูก เช่น price ไม่ใช่ number หรือ name ไม่มีค่า ก็จะส่ง 400 Bad Request กลับไป
6. ถ้าข้อมูลถูกต้อง server จะสร้าง object ใหม่
   มี id, name, price, quantity
   ถ้าไม่ได้ส่ง quantity มา ระบบจะใช้ค่า default เป็น 1
7. server เอา product ใหม่ใส่ลงใน array products
   ด้วย products.push(newProduct)
8. server ส่ง response กลับไป
   พร้อม status 201 Created และส่งข้อมูล product ที่สร้างสำเร็จกลับไปเป็น JSON

---

**8. What is CRUD? Map each operation to the HTTP method and route you used in your API.**

_Your answer:_
CRUD เป็นแนวคิดพื้นฐานของการจัดการข้อมูล โดยย่อมาจาก
Create = สร้างข้อมูลใหม่
Read = อ่านข้อมูล
Update = แก้ไขข้อมูล
Delete = ลบข้อมูล

CRUD ที่ใช้ในโปรเจกต์
Create ใช้ POST /products
Read all ใช้ GET /products
Read one ใช้ GET /products/:id
Update ใช้ PATCH /products/:id
Delete ใช้ DELETE /products/:id

---

**9. How does your API respond when something goes wrong — for example, when a product with a given ID does not exist?**

_Your answer:_
ถ้ามีอะไรผิดพลาด API ในโปรเจกต์นี้จะตอบกลับด้วย status code และ message

- ถ้าหา product ตาม id ไม่เจอ จะตอบ 404 พร้อม message ว่า Product not found
- ถ้า client ส่งข้อมูลไม่ถูกต้อง เช่น price ไม่ใช่ตัวเลข ก็จะตอบ 400 Bad Reques tพร้อม message ที่อธิบายปัญหา
- ถ้าเรียก route ที่ไม่มีอยู่จริง ระบบจะตอบ 404 พร้อม message ว่า Route not found
  มี error-handling middleware อยู่ท้ายสุดเพื่อรับ error ที่ส่งต่อมาจาก route และส่ง response กลับไปในรูปแบบที่เหมือนกัน

---

**10. What was the hardest part of building this API and what did you do to get past it?**

_Your answer:_
ส่วนที่ยากที่สุดคือการใช้ req.body, req.params และ req.query เพราะตอนเริ่มต้นยังสับสนว่าข้อมูลแต่ละแบบมาจากตรงไหน ต่างกันยังไง แต่พอได้ลองทำ route จริงทีละตัว เช่น ใช้ req.params กับ /products/:id ใช้req.body กับ POST และ PATCH และใช้ req.query กับการ filter ชื่อสินค้า ก็ทำให้เริ่มเห็นภาพชัดและเข้าใจมากขึ้น
