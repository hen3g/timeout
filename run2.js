const fetch = require('node-fetch');

async function isHoliday(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${month}-${day}`;
    
    try {
        const response = await fetch(`https://timor.tech/api/holiday/year/${year}`);
        const data = await response.json();

        if (data.code !== 0) {
            throw new Error('获取假期数据失败');
        }
        
        const holidays = data.holiday;
        
        if (holidays[formattedDate]) {
            const holidayInfo = holidays[formattedDate];
            if (holidayInfo.holiday) {
                return { isHoliday: true, name: holidayInfo.name };
            } else {
                return { isHoliday: false, isWorkDay: true, name: holidayInfo.name, workDayNumber: await getWorkDayNumber(date, holidays) };
            }
        } else {
            return { isHoliday: false, isWorkDay: true, workDayNumber: await getWorkDayNumber(date, holidays) };
        }
    } catch (error) {
        console.error('错误:', error);
        return null;
    }
}

async function getWorkDayNumber(date, holidays) {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based
    let workDayCount = 0;

    for (let day = 1; day <= date.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        if (holidays[formattedDate] && holidays[formattedDate].holiday) {
            continue;
        }
        
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            if (!holidays[formattedDate] || !holidays[formattedDate].holiday) {
                continue;
            }
        }

        workDayCount++;
    }

    return workDayCount;
}

// 调用示例
isHoliday(new Date()).then(result => {
    if (result.isHoliday) {
        console.log(`今天是假期: ${result.name}`);
    } else if (result.isWorkDay) {
        if(result.workDayNumber==1){
            fetch(`https://api.day.app/bi7b2i24T32xcbZ63HwHxQ/本月第一个工作日/【提醒】定投、股票相关操作`);
        }

        console.log(`今天是工作日，本月的第 ${result.workDayNumber} 个工作日`);
    }
});