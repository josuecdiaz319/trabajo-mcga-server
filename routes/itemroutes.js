const Item = require('../models/item')
const jwt = require('jsonwebtoken')
const circularjson = require('circular-json')


async function itemExists(itemname)
{
    return await Item.findOne({itemname})
}

module.exports = (app, connector) => {
    app.post(`/api/item/add`, async(req, res) => {
        const itemname = req.body.itemname, description = req.body.description
        console.log("ADD ITEM: Name: " + itemname + " Descripcion:" + description)
        
        let item = await itemExists(itemname)
        if(item)
        {
            res.json({message:'Item existente.'})
        }
        else
        {
            let newitem = new Item({itemname, description}).save()
            res.json({message:'Item creado.'})
        }
    })

    app.post(`/api/item/modify`, async(req, res) => {
        const itemname = req.body.itemname, newname = req.body.newname, newdescription = req.body.newdescription;
        let item = await itemExists(itemname)
        if(item)
        {
            let newitem = await itemExists(newname)
            if(newitem)
            {
                res.json({message:'Nuevo nombre de item ya en uso.'})
            }
            else
            {
                await Item.findOneAndUpdate({itemname}, {itemname: newname, description: newdescription})
                res.json({message:'Item modificado.'})
            }
        }
        else
        {
            res.json({message:'Item no encontrado.'})
        }
    })

    app.post(`/api/item/delete`, async(req, res) => {
        const itemname = req.body.itemname
        let item = await itemExists(itemname)
        if(item)
        {
            await Item.findOneAndDelete({itemname})
            res.json({message:'Item eliminado.'})
        }
        else
        {
            res.json({message:'Item no encontrado.'})
        }
    })

    app.get(`/api/item/getlist/:page/:limit`, async(req, res) => {
        const page = parseInt(req.params.page), limit = parseInt(req.params.limit)
        const skip = (page-1)*limit;
        
        let query = await Item.find({}).skip(skip).limit(limit)

        let list = circularjson.stringify(query)

        res.json({list})
    })
}