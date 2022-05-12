
import "./foo_spider_monkey_panel"

class FileInfo{
    info: { [key: string] : string | Array<string>} = {}
    meta: { [key: string] : string | Array<string>}  = {}
    handle? : FbMetadbHandle
    constructor(file_handle : FbMetadbHandle)
    {

        const file_info = file_handle.GetFileInfo()
        
        if (file_info == null) return;

        for (let i = 0; i < file_info.InfoCount; i++)
        {
            this.info[file_info.InfoName(i)] = file_info.InfoValue(i)
        }

        for (let i = 0; i < file_info.MetaCount; i++)
        {
            if (file_info.MetaValueCount(i) > 1)
            {
                let meta_value = []
                for (let j = 0; j < file_info.MetaValueCount(i); j++)
                {
                    meta_value.push(file_info.MetaValue(i,j))
                }
                this.meta[file_info.MetaName(i)] = meta_value
            }
            else
            {
                this.meta[file_info.MetaName(i)] = file_info.MetaValue(i,0)
            }
        }
        this.handle = file_handle
    }

}


class Playlist
{
    constructor()
    {

    }
    draw()
    {

    }
}

const list = plman.GetPlaylistItems(plman.ActivePlaylist)

for (const i of list)
{
    const f = new FileInfo(i);
    console.log(f.meta);
}