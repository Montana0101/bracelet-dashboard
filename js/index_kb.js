// 手环列表
const bracelet_limit = 15
let bracelet_pageNo = 1
let bracelet_page_total = 0
let barcelet_search_query = ''

// 通知信息
const notice_page_limit = 4
let notice_page_total = 0
let notice_pageNo = 1

// 页面加载
window.onload = function () {
    import_js("js/moment.js")
    import_js("js/lsbridge.min.js")

    get_all_infos() // 通知信息
    get_all_bracelet_list() // 手环列表
    setInterval(`get_all_bracelet_list()`, 30000); // 手环列表--定时请求

    setInterval("update_time()", 1000);
    init_map()

    kb_status_data()
    $("#u19").click(function () {
        isfullScreen()
    })
    $("#u18").click(function () {
        reload_page()
    })

    setInterval("kb_status_data()", 5000);

    $("#u23_div").append('<div  class="bracelet-table">\n' +
        '        <div class="bracelet-table-row">\n' +
        '            <div class="bracelet-table-column1">用户</div>\n' +
        '            <div class="bracelet-table-column2">地址</div>\n' +
        '        </div>\n' +
        '        <div id="table_body" style="width: 311px;height: 530px;overflow-y: scroll">\n' +
        '\n' +
        '        </div>\n' +
        '            <div style="display:flex;justify-content:space-between;font-size:50px;padding:0 70px;z-index:99999">\n' +
        '              <a id="prev_bracelet" style="cursor:pointer"><</a><a id="next_bracelet" style="cursor:pointer">></a></div>\n' +
        '    </div>')

    let timeout = null;
    $("#u26_input").bind("input propertychange", function () {
        searchContent = $("#u26_input").val();
        if (timeout != null) {
            window.clearInterval(timeout)
        }
        timeout = setTimeout(function () {
            timeout = null;
            get_all_bracelet_list()
        }, 500);
    });

    // 手环列表搜索监听
    $('#u24_input').bind("input propertychange", function () {
        barcelet_search_query = $('#u24_input').val();
        get_all_bracelet_list();
        console.log('打印下数据', barcelet_search_query)

    })

    // 通知信息窗口
    $('#u38_container').append('<div id="notice-table" style="width: 100%;height:100%;overflow-y: scroll"></div>')

    $('#u39_container').append('<div  class="bracelet-table" style="width: 100%;height:100%;overflow-y: scroll">\n' +
        '        <div class="bracelet-table-row">\n' +
        '            <div class="bracelet-table-column1">用户</div>\n' +
        '            <div class="bracelet-table-column2">地址</div>\n' +
        '        </div>\n' +
        '        <div class="bracelet-table-row">\n' +
        '            <div class="bracelet-table-column1">用户</div>\n' +
        '            <div class="bracelet-table-column2">地址</div>\n' +
        '        </div>\n' +
        '        <div class="bracelet-table-row">\n' +
        '            <div class="bracelet-table-column1">用户</div>\n' +
        '            <div class="bracelet-table-column2">地址</div>\n' +
        '        </div>\n' +
        '        <div class="bracelet-table-row">\n' +
        '            <div class="bracelet-table-column1">用户</div>\n' +
        '            <div class="bracelet-table-column2">地址</div>\n' +
        '        </div>\n' +
        '        <div class="bracelet-table-row">\n' +
        '            <div class="bracelet-table-column1">用户</div>\n' +
        '            <div class="bracelet-table-column2">地址</div>\n' +
        '        </div>\n' +
        '        <div class="bracelet-table-row">\n' +
        '            <div class="bracelet-table-column1">用户</div>\n' +
        '            <div class="bracelet-table-column2">地址</div>\n' +
        '        </div>\n' +
        '        <div class="bracelet-table-row">\n' +
        '            <div class="bracelet-table-column1">用户</div>\n' +
        '            <div class="bracelet-table-column2">地址</div>\n' +
        '        </div>\n' +
        '    </div>')

    // 手环列表上一页
    $('#prev_bracelet').click(function () {
        if (bracelet_pageNo > 1) {
            bracelet_pageNo -= 1
            get_all_bracelet_list()
        } else {
            console.log('没有上一页咯')
        }

    })

    // 手环列表下一页
    $('#next_bracelet').click(function () {
        if (bracelet_page_total > bracelet_pageNo) {
            bracelet_pageNo += 1
            get_all_bracelet_list()
        } else {
            console.log('没有下一页咯')
        }

    })

    // 通知上一页
    $('#prev_notice').click(function () {
        if (notice_pageNo > 1) {
            notice_pageNo -= 1
            get_all_infos()
        } else {
            console.log('没有上一页咯')
        }

    })

    // 通知下一页
    $('#next_notice').click(function () {
        console.log('打印下数据',notice_page_total,notice_pageNo)
        if (notice_page_total > notice_pageNo) {
            notice_pageNo += 1
            get_all_infos()
        } else {
            console.log('没有下一页咯')
        }

    })
}
let searchContent = "";

function kb_status_data() {
    $.get("https://www.bdvmp.com/bracelet-wechat-service/api/kb/get_status", function (data) {
        // console.log('获取看板状态数据', data)
        if (data.code == 2000) {
            $("#u5_text").text(data.result.wechartUser)
            $("#u8_text").text(data.result.bracelet)
            $("#u12_text").text(data.result.sos)
            $("#u16_text").text(data.result.fence)
            $("#u36_text").text(data.result.access)
        }
    })
}


function init_bracelet_list_table(data) {
    $("#table_body").empty()
    data.forEach(function (item) {
        let table_row = '    <div id="b_' + item.braceletId + '" class="bracelet-table-row">\n' +
            '        <div class="bracelet-table-column1">' + item.name + '</div>\n' +
            '        <div class="bracelet-table-column2" title="' + item.address + '">' + item.address + '</div>\n' +
            '    </div>'
        $("#table_body").append(table_row)
        $("#b_" + item.braceletId).click(function () {
            lsbridge.send('select_bracelet', item.braceletId);
        });
    })
}

function init_infos_list_table(data) {
    $("#notice-table").empty()
    console.log('打印下Infossssssssss~~~',data)
    data.forEach(function (item) {
        console.log('大图标选啊',item.body)
        let table_row = '  <div class="notice-table-row">\n' +
            '        <div class="notice-table-column1">' + item.dataTime + '</div>\n' +
            '        <div class="notice-table-column2">' + item.body + '</div>\n' +
            '    </div>'
        $("#notice-table").append(table_row)
    })
}

// 获取手环列表
function get_all_bracelet_list() {
    $.get(`https://www.bdvmp.com/bracelet-wechat-service/api/kb/get_all_bracelet_list?page=${bracelet_pageNo}&limit=${bracelet_limit}&search=${barcelet_search_query}`
        , function (data) {
            if (data.code == 2000) {
                bracelet_page_total = data.result.totalPage
                let dataArray = [];
                data.result.data.forEach(function (item) {
                    if (item.name.indexOf(searchContent) != -1 || item.address.indexOf(searchContent) != -1) {
                        dataArray.push(item)
                    }
                })
                lsbridge.send('bracelet_datas', dataArray);
  
                init_bracelet_list_table(dataArray)
            }
        })
}

// 获取通知信息
function get_all_infos() {
    $.get(`https://www.bdvmp.com/bracelet-wechat-service/api/kb/get_notice?page=${notice_pageNo}&limit=${notice_page_limit}`
        , function (data) {
            if (data.code == 2000) {
                notice_page_total = data.result.totalPage
                console.log('通知信息接口~~~~~', data.result)
                init_infos_list_table(data.result.data)
            }
        })
}

function get_inform_message() {

}

function reload_page() {
    location.reload();
}

function init_map() {
    $("#u30_div").append(" <iframe id=\"main_iframe\" name=\"main_iframe\" height=\"100%\" width=\"100%\" frameborder=\"0\" src=\"map.html\"></iframe>")
}

function update_time() {
    document.getElementById("u22_text").innerHTML = moment(new Date()).format('YYYY-MM-DD HH:mm');
}

function import_js(src) {
    var ele = document.createElement("script");
    ele.setAttribute("type", "text/javascript");
    ele.setAttribute("src", src);
    document.body.appendChild(ele);
}

function isfullScreen() {
    var isFull = !!(document.webkitIsFullScreen || document.mozFullScreen ||
        document.msFullscreenElement || document.fullscreenElement
    );//!document.webkitIsFullScreen都为true。因此用!!
    if (isFull == false) {
        fullScreen()
        $("#u25_text").text("退出全屏")
    } else {
        $("#u25_text").text("全屏")
        exitFullscreen()
    }
}

function fullScreen() {
    var element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}