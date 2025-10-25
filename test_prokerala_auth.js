#!/usr/bin/env node

/**
 * Prokerala API 认证测试脚本
 * 测试OAuth2 Client Credentials流程
 */

const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

const PROKERALA_BASE_URL = 'https://api.prokerala.com';

async function testProkeralaAuth() {
    console.log('🔮 测试 Prokerala API 认证...\n');
    
    // 检查环境变量
    const clientId = process.env.PROKERALA_CLIENT_ID;
    const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
    
    console.log('📋 环境变量检查:');
    console.log(`   CLIENT_ID: ${clientId ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`   CLIENT_SECRET: ${clientSecret ? '✅ 已配置' : '❌ 未配置'}\n`);
    
    if (!clientId || !clientSecret || clientId === 'your_client_id_here') {
        console.log('⚠️  请先配置真实的 Prokerala API 凭证:');
        console.log('   1. 访问 https://api.prokerala.com');
        console.log('   2. 注册账户并获取 CLIENT_ID 和 CLIENT_SECRET');
        console.log('   3. 更新 backend/.env 文件中的凭证\n');
        return;
    }
    
    try {
        // 步骤1: 获取访问令牌
        console.log('🔐 步骤1: 获取访问令牌...');
        const tokenResponse = await axios.post(`${PROKERALA_BASE_URL}/token`, 
            `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 10000
            }
        );
        
        const { access_token, token_type, expires_in } = tokenResponse.data;
        console.log(`   ✅ 认证成功!`);
        console.log(`   Token类型: ${token_type}`);
        console.log(`   过期时间: ${expires_in}秒\n`);
        
        // 步骤2: 测试出生图表API
        console.log('📊 步骤2: 测试出生图表API...');
        const chartResponse = await axios.get(`${PROKERALA_BASE_URL}/v2/astrology/birth-chart`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
            params: {
                datetime: '1993-11-20T19:55:00+08:00',
                latitude: 39.9042,
                longitude: 116.4074,
                'chart-type': 'rasi',
                ayanamsa: 'lahiri'
            },
            timeout: 15000
        });
        
        console.log(`   ✅ 出生图表API调用成功!`);
        console.log(`   响应状态: ${chartResponse.status}`);
        console.log(`   数据大小: ${JSON.stringify(chartResponse.data).length} 字符\n`);
        
        // 步骤3: 测试大运API
        console.log('⏰ 步骤3: 测试大运API...');
        const dashaResponse = await axios.get(`${PROKERALA_BASE_URL}/v2/astrology/dasha-periods`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
            params: {
                datetime: '1993-11-20T19:55:00+08:00',
                latitude: 39.9042,
                longitude: 116.4074,
                ayanamsa: 'lahiri'
            },
            timeout: 15000
        });
        
        console.log(`   ✅ 大运API调用成功!`);
        console.log(`   响应状态: ${dashaResponse.status}`);
        console.log(`   数据大小: ${JSON.stringify(dashaResponse.data).length} 字符\n`);
        
        console.log('🎉 Prokerala API 配置测试完成!');
        console.log('   所有API端点都工作正常，可以开始使用真实数据。\n');
        
    } catch (error) {
        console.error('❌ API测试失败:');
        
        if (error.response) {
            console.error(`   HTTP状态: ${error.response.status}`);
            console.error(`   错误信息: ${error.response.data?.message || error.response.statusText}`);
            
            if (error.response.status === 401) {
                console.error('   💡 提示: 请检查 CLIENT_ID 和 CLIENT_SECRET 是否正确');
            } else if (error.response.status === 429) {
                console.error('   💡 提示: API请求频率过高，请稍后重试');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('   ⏰ 请求超时，请检查网络连接');
        } else {
            console.error(`   错误: ${error.message}`);
        }
        
        console.log('\n🔧 故障排除建议:');
        console.log('   1. 检查网络连接');
        console.log('   2. 验证API凭证是否正确');
        console.log('   3. 确认Prokerala账户状态');
        console.log('   4. 检查API使用限额\n');
    }
}

// 运行测试
if (require.main === module) {
    testProkeralaAuth().catch(console.error);
}

module.exports = { testProkeralaAuth };
