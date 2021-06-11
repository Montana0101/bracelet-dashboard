// import * as echarts from 'echarts';
// const echarts = require('echarts')

var chartDom = document.getElementById('echarts_container');
var myChart = echarts.init(chartDom);
var option;

console.log('大把机会的撒不急哈')


let dateArea=[]
let sos=[]
let fence=[]
let access=[]

const get_data = () => {
    $.get(`https://www.bdvmp.com/bracelet-wechat-service/api/kb/get_statistics`
    , function (data) {
        if (data.code == 2000) {
            console.log('打印下数据',data.result[0])
            // dateArea.push[data.result[0].dateTime]
            // dateArea.push[data.result.reverse()[0].dateTime]
            data.result.map(item=>{
                sos.push(item.sos)
                fence.push(item.fence)
                access.push(item.access)
            })
            dateArea.push(data.result[0].dateTime)
            dateArea.push(data.result.reverse()[0].dateTime)
        
            option = {
                title: {
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['sos报警数', '围栏报警数', '访问量',],
                    textStyle: {
                        color: '#FFFFFF'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    height:'77%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dateArea
                },
                yAxis: {
                    type: 'value',
                    "axisTick":{       //y轴刻度线
                        "show":true
                      },
                      "splitLine": {     //网格线
                        "show": false
                      }
                },
                series: [
                    {
                        name: 'sos报警数',
                        type: 'line',
                        stack: '总量',
                        data: sos,
                    
                    },
                    {
                        name: '围栏报警数',
                        type: 'line',
                        stack: '总量',
                        data: fence
                    },
                    {
                        name: '访问量',
                        type: 'line',
                        stack: '总量',
                        data: access
                    }
                ]
            };
            
            
            option && myChart.setOption(option);
        }
    })
}
get_data()


