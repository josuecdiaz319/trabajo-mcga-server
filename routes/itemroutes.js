const Item = require('../models/item')
const jwt = require('jsonwebtoken')
const circularjson = require('circular-json')


async function itemExists(itemname)
{
    return await Item.findOne({itemname})
}


module.exports = (app, connector) => {
    app.post(`/api/item/add`, async(req, res) => {
        const token = req.header('token')
        jwt.verify(token, 'laweacuantica', async(err, decoded) => {
            if(err)
            {
                res.status(300).json({message: "Token inválido"})
            }
            else
            {
                const itemname = req.body.itemname, description = req.body.description
                console.log("ADD ITEM: Name: " + itemname + " Descripcion:" + description)
        
                const item = await itemExists(itemname)
                if(item)
                {
                    res.status(301).json({message:'Item existente.'})
                }
                else
                {
                    await new Item({itemname, description}).save()
                    res.status(200).json({message:'Item creado.'})
                }
            }
        });
        
    })

    app.post(`/api/item/modify`, async(req, res) => {
        const token = req.header('token')
        jwt.verify(token, 'laweacuantica', async(err, decoded) =>  {
            if(err)
            {
                res.status(300).json({message: "Token inválido"})
            }
            else
            {
                const itemname = req.body.itemname, newname = req.body.newname, newdescription = req.body.newdescription;
                let item = await itemExists(itemname)
                if(item)
                {
                    let newitem = await itemExists(newname)
                    if(newitem)
                    {
                        res.status(301).json({message:'Nuevo nombre de item ya en uso.'})
                    }
                    else
                    {
                        console.log("MODIFY ITEM: itemname:" + itemname + " newname:" + newname + " newdescription:" + newdescription)
                        if(itemname == newname)
                            await Item.findOneAndUpdate({itemname}, {description: newdescription})
                        else
                            await Item.findOneAndUpdate({itemname}, {itemname: newname, description: newdescription})
                        res.status(200).json({message:'Item modificado.'})
                    }
                }
                else
                {
                    res.status(302).json({message:'Item no encontrado.'})
                }
            }
        });
    })

    app.post(`/api/item/delete`, async(req, res) => {
        const token = req.header('token')
        jwt.verify(token, 'laweacuantica', async(err, decoded) => {
            if(err)
            {
                res.status(300).json({message: "Token inválido"})
            }
            else
            {
                const itemname = req.body.itemname
                console.log("itemname:" + itemname)
                let item = await itemExists(itemname)
                if(item)
                {
                    await Item.findOneAndDelete({itemname})
                    res.status(200).json({message:'Item eliminado.'})
                }
                else
                {
                    res.status(301).json({message:'Item no encontrado.'})
                }
            }
        });
    })

    app.get(`/api/item/getlist/:page/:limit`, async(req, res) => {
        const token = req.header('token')

        //console.log("recibido")
        //console.log(token)

        await jwt.verify(token, 'laweacuantica', async(err, decoded) =>  
        {
            if(err)
            {   
                res.status(200).json({message: "Token inválido"})
            }
            else
            {
                const page = parseInt(req.params.page), limit = parseInt(req.params.limit)
                const skip = (page-1)*limit;

                const query = await Item.find({}).skip(skip).limit(limit)

                const list = circularjson.stringify(query)
                
               
                res.status(200).json({list})
                
            }
        })
    })
}


 