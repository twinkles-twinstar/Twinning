set_project('TwinStar.ToolKit.Core')

add_rules('mode.debug', 'mode.release')

add_moduledirs('../common/xmake')
includes('../common/xmake/custom.lua')
apply_common_setting()

includes('./third/mscharconv')
includes('./third/fmt')
includes('./third/tinyxml2')
includes('./third/md5')
includes('./third/Rijndael')
includes('./third/zlib')
includes('./third/bzip2')
includes('./third/lzma')
includes('./third/libpng')
includes('./third/ETCPACK')
includes('./third/rg_etc1')
includes('./third/PVRTCCompressor')
if m.system:is('linux', 'macintosh', 'android', 'iphone') then
	includes('./third/quickjs')
end
if m.system:is('windows') then
	includes('./third/quickjs.c_smile')
end

includes('./core')

includes('./test')
