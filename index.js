const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');


const MongoDBclient = new MongoClient('mongodb://127.0.0.1:27017')


// ициализация express + cors + bodyParser
const app = express()
app.use(cors())
app.use(bodyParser.json());

const port = 5000

const reTest = async () =>{
    try {
        await MongoDBclient.connect()
        console.log("Успешно подключились к базе данных")
        await MongoDBclient.close()
        console.log("Подключение закрыто")
    } catch (e) {
        console.log(e)
    }
 }
 reTest()

 // записывает категорию товара для клиента
 // на стороне  фронтенда передётся email пользователя
 app.post('/api/client', async (req, res) => {
    try {
      await MongoDBclient.connect({
        // Увеличение максимального количества соединений до 10
        // Увеличение максимального времени ожидания неактивного соединения до 60 секунд
        pool: { maxPoolSize: 10, maxIdleTime: 60000 },
      })
      const exployees = MongoDBclient.db('expdate').collection('client')
      await exployees.insertOne(req.body)
      res.json(req.body)
      console.log('success ')
    } catch (err) {
        res.status(500).send(err.message);
        console.error(err)
    } finally {
        await MongoDBclient.close()
  }
  })

  app.delete('/api/client', async (req, res) => {
    try {
      await MongoDBclient.connect({
        // Увеличение максимального количества соединений до 10
        // Увеличение максимального времени ожидания неактивного соединения до 60 секунд
        pool: { maxPoolSize: 10, maxIdleTime: 60000 },
      })
      const exployees = MongoDBclient.db('expdate').collection('client')
      await exployees.deleteMany()
      res.json(req.body)
      console.log('success')
    } catch (err) {
        res.status(500).send(err.message);
        console.error(err)
    } finally {
        await MongoDBclient.close()
  }
  })

  // получаем  клиента
 // на стороне фронтенда передётся email пользователя из firebase
  app.get('/api/client/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
      await MongoDBclient.connect({
        // Увеличение максимального количества соединений до 10
        // Увеличение максимального времени ожидания неактивного соединения до 60 секунд
        pool: { maxPoolSize: 10, maxIdleTime: 60000 },
      });
      const exployees = MongoDBclient.db('expdate').collection('client')
      const filter = { uuid: uuid };
      const data = await exployees.find(filter).toArray();
  
      res.json(data)
  
    } catch(err) {
      console.log('Ошибка получения: ' + err);
    } finally {
      console.log('Получено')
      MongoDBclient.close();
    }
  })
  
  // сохраняем категорию у клиента
  app.post('/api/client/categories', async (req, res) => {
    try {
      await MongoDBclient.connect({
        // Увеличение максимального количества соединений до 10
        // Увеличение максимального времени ожидания неактивного соединения до 60 секунд
        pool: { maxPoolSize: 10, maxIdleTime: 60000 },
      })
      const exployees = MongoDBclient.db('expdate').collection('client')
      const category = req.body.category
      await exployees.updateOne(
        { uuid: "admin" },
        { 
          $push: {
            categories: {
              title : category, 
              products: []
            } 
          }
        }
      );
      res.json(req.body)
      console.log('success ')
    } catch (err) {
        res.status(500).send(err.message);
        console.error(err)
    } finally {
        await MongoDBclient.close()
  }
  })

  // сохраняем продукт в категории у клиента
  app.post('/api/client/categories/product', async (req, res) => {
    try {
      await MongoDBclient.connect({
        // Увеличение максимального количества соединений до 10
        // Увеличение максимального времени ожидания неактивного соединения до 60 секунд
        pool: { maxPoolSize: 10, maxIdleTime: 60000 },
      })
      const exployees = MongoDBclient.db('expdate').collection('client')
      const category = req.body.category
      const product = req.body.product
      await exployees.updateOne(
        {
          uuid: "admin",
          "categories.title": category,
        },
        {
          $push: {
            "categories.$.products": 
              product,
          },
        }
      );
      res.json(req.body)
      console.log('success ')
    } catch (err) {
        res.status(500).send(err.message);
        console.error(err)
    } finally {
        await MongoDBclient.close()
  }
  })

  // удаляем продукт в категории у клиента
  app.delete('/api/client/categories/product/:category/:formalId', async (req, res) => {
    try {
      await MongoDBclient.connect({
        pool: { maxPoolSize: 10, maxIdleTime: 60000 },
      })
      const exployees = MongoDBclient.db('expdate').collection('client')
      const category = req.params.category
      const product = req.params.formalId
      console.log(category, product)
      await exployees.updateOne(
        {
          uuid: "admin",
          "categories.title": category,
        },
        {
          $pull: {
            "categories.$.products": {
              formalId: product,
            },
          },
        }
      );
      res.json(req.body)
      console.log('success ')
    } catch (err) {
        res.status(500).send(err.message);
        console.error(err)
    } finally {
        await MongoDBclient.close()
  }
  })

 app.get('/', (req, res) => {
    res.send('success')
  })


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })