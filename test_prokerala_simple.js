#!/usr/bin/env node

/**
 * 简单的Prokerala API测试
 * 使用curl命令测试认证
 */

const { exec } = require('child_process');
const fs = require('fs');

console.log('🔮 Prokerala API 配置测试\n');

// 检查环境变量文件
const envPath = './backend/.env';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📋 环境变量配置:');
    
    const hasClientId = envContent.includes('PROKERALA_CLIENT_ID=') && 
                       !envContent.includes('PROKERALA_CLIENT_ID=your_client_id_here');
    const hasClientSecret = envContent.includes('PROKERALA_CLIENT_SECRET=') && 
                           !envContent.includes('PROKERALA_CLIENT_SECRET=your_client_secret_here');
    
    console.log(`   CLIENT_ID: ${hasClientId ? '✅ 已配置' : '❌ 需要配置'}`);
    console.log(`   CLIENT_SECRET: ${hasClientSecret ? '✅ 已配置' : '❌ 需要配置'}\n`);
    
    if (!hasClientId || !hasClientSecret) {
        console.log('⚠️  请先配置真实的Prokerala API凭证:');
        console.log('   1. 访问 https://api.prokerala.com');
        console.log('   2. 注册账户并获取凭证');
        console.log('   3. 更新 backend/.env 文件\n');
        return;
    }
} else {
    console.log('❌ 未找到环境变量文件: backend/.env\n');
    return;
}

// 测试API连接
console.log('🔐 测试API连接...');
exec('curl -X POST https://api.prokerala.com/token -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=client_credentials&client_id=test&client_secret=test" --connect-timeout 10', (error, stdout, stderr) => {
    if (error) {
        console.log('❌ 网络连接失败:', error.message);
        return;
    }
    
    if (stdout.includes('Authentication Error')) {
        console.log('✅ API端点可访问，但需要真实凭证');
        console.log('   响应:', stdout.trim());
    } else {
        console.log('✅ API连接正常');
        console.log('   响应:', stdout.trim());
    }
    
    console.log('\n🎯 下一步:');
    console.log('   1. 获取真实的Prokerala API凭证');
    console.log('   2. 更新 backend/.env 文件');
    console.log('   3. 重启后端服务');
    console.log('   4. 测试完整功能\n');
});