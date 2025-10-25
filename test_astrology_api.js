const http = require('http');

// 配置
const HOST = 'localhost';
const PORT = 3001;

// 测试数据 - 用户提供的出生信息
const testBirthInfo = {
  name: 'Test User',
  date: '1993-11-20',
  time: '19:55',
  city: 'Beijing',
  latitude: 39.9042,
  longitude: 116.4074,
  timezone: 'Asia/Shanghai'
};

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsedData, headers: res.headers });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData, headers: res.headers });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAstrologyAPI() {
  console.log('🧪 测试占星API并获取完整数据...\n');
  console.log('📋 出生信息:', JSON.stringify(testBirthInfo, null, 2));
  console.log('\n');

  try {
    console.log('📡 发送POST请求到 /api/astrology/chart...\n');
    
    const chartOptions = {
      hostname: HOST,
      port: PORT,
      path: '/api/astrology/chart',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(testBirthInfo))
      }
    };
    
    const response = await makeRequest(chartOptions, testBirthInfo);

    console.log('✅ API调用成功!\n');
    console.log('📊 完整API返回数据:');
    console.log('=' .repeat(80));
    console.log(JSON.stringify(response.data, null, 2));
    console.log('=' .repeat(80));
    
    // 保存到文件
    const fs = require('fs');
    const outputFile = 'api_response_1993.json';
    fs.writeFileSync(outputFile, JSON.stringify(response.data, null, 2), 'utf-8');
    console.log(`\n💾 完整数据已保存到: ${outputFile}`);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    throw error;
  }
}

// 运行测试
testAstrologyAPI()
  .then(() => {
    console.log('\n✅ 测试完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }); 