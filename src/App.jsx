import { useState, useEffect } from 'react'
import { LIST_BASE_URL } from './const'
import { Card } from 'antd'
import './App.css'

function App() {
  const [list, setList] = useState([])

  const fetchBathList = async () => {
    try {

      let response = await fetch(LIST_BASE_URL)
      let outerList = await response.json()
      outerList = outerList.results
      console.log(outerList, 'outerList');

      let innerLst = await Promise.allSettled(outerList.map((async item => {
        let res1 = await fetch(item.url)
        console.log(res1, 'res1');
        let res1data = await res1.json()
        return res1data
      })))

      innerLst = innerLst.map(item => item.value)

      console.log(innerLst, 'innerLst-zz');


      const myUIdata = outerList.map((item, index) => {
        return {
          name: item?.name,
          order: innerLst[index]?.order,
          id: innerLst[index]?.id,
          image: innerLst[index]?.sprites?.back_default
        }
      })
      setList(myUIdata);

    } catch (error) {
      console.log(error, 'zz-err');

    }

  }

  useEffect(() => {
    fetchBathList()
  }, [])

  return (
    <>
      <div className='card-group-wraper'>
        {list && list.length && list.map((item) => {
          return (
            <Card key={item.id} style={{ width: 300 }}>
              <p><img src={item.image} /></p>
            </Card>
          )
        })}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
