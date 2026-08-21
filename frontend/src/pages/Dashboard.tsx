import {useEffect, useState} from "react";
import api from "../api/axios";

function Dashboard(){

const [data,setData]=useState([]);


useEffect(()=>{

api.get("/stats/daily")
.then(res=>{
    setData(res.data);
})

},[]);


return(
<div>

<h1 className="text-4xl font-bold">
LC Pulse
</h1>


<pre>
{JSON.stringify(data,null,2)}
</pre>


</div>
)

}

export default Dashboard;