import React,{useState,useEffect,useCallback} from 'react';
import Tabletop from 'tabletop'
import DataTable from 'react-data-table-component';
import Nav from './Nav';
import Hderimg from './header.jpg'

const Popup = ({tx,ty,close})=>{
    return (   <>
        <div className="popup">
            <div className="popup-content">
            <div className="popup-close" onClick={()=>{close(false)}} >X</div>
            <div className="popup-wrapper">
        <h3 className="popuptype">{ty}</h3>
            <p className="popuptext">{tx}</p>
            </div>
            </div>
            <div className="popup-bg" onClick={()=>{close(false)}}></div>
        </div>
        
        </>
    )
}


function Homepage() {

const CustomLoader = () => (
    <div style={{ padding: '24px' }}>
      <div>Loading/กำลังโหลด</div>
    </div>
  );
const textcut = (d)=>{
  if(d.length >= 90){
    return d.slice(0, 87)+"..."
  }else{
    return d
  }
}

    const [comdatas,setcomdatas] = useState([])
    const [panding,setpanding] = useState(true)
    const [ispopup,setispopup] = useState(false)
    const [filtervalue,setfiltervalue] = useState([])
    const [popupdata,setpopupdata] = useState({})
    const [searchv,setsearchv] = useState()
    const columns = [
        {
          name: 'เรื่อง',
          selector: 'type',
          sortable: true,
          cell: d => d.type,

        },
        {
          name: 'ปัญหา/ข้อเสนอแนะ',
          selector: 'comment',
          sortable: true,
          cell: d => textcut( d.comment),

         
        },
      ]
    const getandrefresh = useCallback(
      () => {
        Tabletop.init({
          key:'<googleformapi>',
          simpleSheet:true
      }).then(function(data,_) { 
          let keepdata = []
          data.map(item=>{
              if(item.isshow === "ยินยอม"){
                   keepdata = [...keepdata,{id:item.Timestamp,comment:item.comment,isshow:item.isshow,type:item.type}]
              }
              return null
          })
              setcomdatas(keepdata)
              setpanding(false)
        })
      },
      [],
    )
    useEffect(()=>{
        Tabletop.init({
            key:'<googleformapi>',
            simpleSheet:true
        }).then(function(data,_) { 
            let keepdata = []
            data.map(item=>{
                if(item.isshow === "ยินยอม"){
                     keepdata = [...keepdata,{id:item.Timestamp,comment:item.comment,isshow:item.isshow,type:item.type}]
                }
                return null
            })
                setcomdatas(keepdata)
                setpanding(false)
          })
    },[])

    useEffect(() => {
      const timer = setInterval(() => {
        getandrefresh()
      }, 10000);
      return () => clearInterval(timer);
    }, [getandrefresh]);


    const filterdata = useCallback((searchda)=>{
        if(searchda){
            const data = comdatas.filter(item=>{
                return item.type.includes(searchda) || item.comment.includes(searchda)
            })
            setfiltervalue(data.reverse())
        }else{
            setfiltervalue(comdatas.reverse())
        } },[comdatas])
    
    const trytosetpopup = (data)=>{
        setpopupdata({tx:data.comment,ty:data.type})
        setispopup(true)
    }

    useEffect(()=>{
      filterdata(searchv)
    },[comdatas,filterdata,searchv])

  return (


    <div className="homepage">
        {ispopup && <Popup tx={popupdata.tx} ty={popupdata.ty} close={setispopup}/>}
        
        <Nav/>
        <div className="hero" style={{backgroundImage: `URL(${Hderimg})`}}>
            <h1>ขณะนี้มีความคิดเห็นทั้งหมด</h1>
            <h2> {panding ? "loading" : `${comdatas.length}` } {panding === false && <span className="num-back">ความคิดเห็น</span>} </h2>
        </div>
        
        <div className="table-padding">
        <div className="wrapper">
        <input type="text" placeholder="ค้นหา" className="search"  onChange={e=>{setsearchv(e.target.value)}} />
      <DataTable
        title="ความเห็นและข้อเสนอแนะ"
        columns={columns}
        data={filtervalue}
        progressPending={panding}
        progressComponent={<CustomLoader />}
        paginationPerPage={20}
        onRowClicked= {data=> trytosetpopup(data)}
        noDataComponent = {(<p>ไม่มีข้อมูลในขณะนี้</p>)}
        className = "tablet"
        highlightOnHover
        pagination
      />
      </div>
      </div>
    </div>
  );
}

export default Homepage;
