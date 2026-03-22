export default {
  content:['./index.html','./src/**/*.{ts,tsx}'],
  theme:{
    extend:{
      colors:{
        primary:{'50':'#eff6ff','100':'#dbeafe','500':'#3b82f6','600':'#2563eb','700':'#1d4ed8','DEFAULT':'#1A6BCC','dark':'#0F4E9E'},
        slate:{50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a'}
      },
      fontFamily:{sans:['Plus Jakarta Sans','sans-serif']}
    }
  },
  plugins:[]
};
