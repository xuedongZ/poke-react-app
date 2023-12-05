import { useState, useEffect } from 'react'
import { LIST_BASE_URL } from './const'
import { Card, Pagination } from 'antd'
import viteLogo from '/vite.svg'
import './App.css'

const initData = {
  list: [],
  pageNo: 1,
  pageSize: 20,
  total: 0
}

function App() {
  const [data, setData] = useState(initData)
  const [loading, setLoading] = useState(true)

  const updateData = (value = {}) => {
    setData(prev => ({
      ...data,
      ...prev,
      ...value
    }))
  }

  const fetchListByPape = async (page = 0) => {
    setLoading(true)
    try {

      let response = await fetch(`${LIST_BASE_URL}?offset=${(page - 1) * 20}limit=20`)
      let outerRes = await response.json()
      let outerList = outerRes.results

      let innerList = await Promise.allSettled(outerList.map((async item => {
        let res1 = await fetch(item.url)
        let res1data = await res1.json()
        return res1data
      })))

      innerList = innerList.map(item => item.value)

      const myUIdata = outerList.map((item, index) => {
        return {
          name: item?.name,
          order: innerList[index]?.order,
          id: innerList[index]?.id,
          image: innerList[index]?.sprites?.back_default
        }
      })
      updateData({ list: myUIdata, total: outerRes.count, pageNo: page })

    } catch (error) {
      console.log(error, 'zz-err');
    } finally {
      setLoading(false)
    }
  }


  const onChange = (page) => {
    fetchListByPape(page)
  }

  useEffect(() => {
    // fetchBathList()
    let page = 1
    fetchListByPape(page)
  }, [])

  if (loading) {
    return 'loading...'
  }

  return (
    <>
      <div className='card-group-wraper'>
        {data.list && data.list.length > 0 && data.list.map((item) => {
          return (
            <div key={item.id} className='card-item'  >
              <Card style={{ width: 260, borderWidth: 2 }}>
                <div className='card-img'>
                  <img src={item?.image || viteLogo} />
                  {item.error && 'api error'}
                </div>
                <p>{item.name}</p>
                <div>#{item.id}</div>
              </Card>
            </div>
          )
        })}
      </div>

      <Pagination
        defaultPageSize={20}
        showQuickJumper
        defaultCurrent={1}
        current={data.pageNo}
        total={data?.total}
        onChange={onChange}
        showSizeChanger={false} />
    </>
  )
}

export default App
