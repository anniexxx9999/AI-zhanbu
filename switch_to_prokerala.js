#!/usr/bin/env node

/**
 * 自动切换到Prokerala API的配置脚本
 */

const fs = require('fs');
const { exec } = require('child_process');

console.log('🔄 自动切换到Prokerala API...\n');

// 检查当前环境变量
const envPath = './backend/.env';
if (!fs.existsSync(envPath)) {
    console.log('❌ 未找到环境变量文件: backend/.env');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
console.log('📋 当前配置状态:');

const hasClientId = envContent.includes('PROKERALA_CLIENT_ID=') && 
                   !envContent.includes('PROKERALA_CLIENT_ID=your_client_id_here');
const hasClientSecret = envContent.includes('PROKERALA_CLIENT_SECRET=') && 
                       !envContent.includes('PROKERALA_CLIENT_SECRET=your_client_secret_here');

console.log(`   CLIENT_ID: ${hasClientId ? '✅ 已配置' : '❌ 需要配置'}`);
console.log(`   CLIENT_SECRET: ${hasClientSecret ? '✅ 已配置' : '❌ 需要配置'}\n`);

if (!hasClientId || !hasClientSecret) {
    console.log('⚠️  需要配置真实的Prokerala API凭证:');
    console.log('   1. 访问 https://api.prokerala.com');
    console.log('   2. 注册账户并获取凭证');
    console.log('   3. 更新 backend/.env 文件\n');
    
    console.log('📝 配置步骤:');
    console.log('   1. 编辑 backend/.env 文件');
    console.log('   2. 替换以下占位符:');
    console.log('      PROKERALA_CLIENT_ID=your_actual_client_id');
    console.log('      PROKERALA_CLIENT_SECRET=your_actual_client_secret');
    console.log('   3. 重启后端服务\n');
    
    process.exit(0);
}

console.log('✅ Prokerala API凭证已配置，开始切换...\n');

// 重启后端服务
console.log('🔄 重启后端服务...');
exec('pkill -f "node dist/server.js"', (error) => {
    if (error && !error.message.includes('No matching processes')) {
        console.log('⚠️  停止服务时出现警告:', error.message);
    }
    
    console.log('⏳ 等待服务停止...');
    setTimeout(() => {
        console.log('🚀 启动后端服务...');
        exec('cd backend && npm start', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ 启动服务失败:', error.message);
                return;
            }
            
            console.log('✅ 后端服务已启动');
            console.log('📊 服务状态:', stdout);
            
            // 等待服务启动
            setTimeout(() => {
                console.log('\n🧪 测试API切换...');
                testApiSwitch();
            }, 3000);
        });
    }, 2000);
});

function testApiSwitch() {
    exec('curl --noproxy localhost -X POST http://localhost:3001/api/astrology/chart -H "Content-Type: application/json" -d \'{"name":"测试用户","date":"1993-11-20","time":"19:55","city":"北京","latitude":39.9042,"longitude":116.4074,"timezone":"Asia/Shanghai"}\' | jq \'.data.source\'', (error, stdout, stderr) => {
        if (error) {
            console.error('❌ API测试失败:', error.message);
            return;
        }
        
        const source = stdout.trim().replace(/"/g, '');
        console.log(`📊 当前数据源: ${source}`);
        
        if (source === 'Prokerala') {
            console.log('🎉 成功切换到Prokerala API!');
            console.log('✅ 系统现在使用专业级数据源');
        } else if (source === 'VedAstro') {
            console.log('⚠️  仍在使用VedAstro API (可能已达到限额)');
            console.log('💡 建议配置Prokerala API以获得更好的服务');
        } else {
            console.log('📝 使用模拟数据回退');
            console.log('💡 配置Prokerala API以获得真实数据');
        }
        
        console.log('\n🎯 下一步:');
        console.log('   1. 验证API功能正常');
        console.log('   2. 测试所有端点');
        console.log('   3. 监控系统性能');
    });
}
