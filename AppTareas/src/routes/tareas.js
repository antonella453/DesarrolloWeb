const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');



const calculateDaysRemaining = (fecfinal) => {
    const today = new Date();  
    const targetDate = new Date(fecfinal);  
    const difference = targetDate - today;  
    const daysRemaining = Math.ceil(difference / (1000 * 3600 * 24));  
    
    if (daysRemaining <= 0) {
        return "Vencido";
    }
    else if (daysRemaining >= 0) {
        return daysRemaining +" "+ 'dias';
    }
    
    return daysRemaining;
};



const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


router.get('/add', isLoggedIn, async (req, res) => {
    try {

        const estados = await pool.query('SELECT * FROM estado');
        const prioridades = await pool.query('SELECT * FROM prioridad');
        const categorias = await pool.query('SELECT * FROM categoria');
        
        res.render('tareas/add', { estados, prioridades, categorias });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).send('Error al cargar los datos');
    }
});


router.post('/add', isLoggedIn, async (req, res) => {
    const { title, description, Fecfinal, estado_id, categoria_id, prioridad_id } = req.body;
    const newTarea = {
        title,
        description,
        Fecfinal,
        estado_id,  
        categoria_id,  
        prioridad_id,  
        user_id: req.user.id
    };
    await pool.query('INSERT INTO tareas set ?', [newTarea]);
    req.flash('success', 'Task saved successfully');
    res.redirect('/tareas');
});


router.get('/', isLoggedIn, async (req, res) => {
    const search = req.query.search || ''; 

    try {
        let sql = `
            SELECT 
                t.id, 
                t.title, 
                t.description, 
                t.Fecfinal, 
                t.created_at, 
                e.nombre AS estado, 
                p.nombre AS prioridad, 
                c.nombre AS categoria, 
                t.estado_id, 
                t.prioridad_id, 
                t.categoria_id 
            FROM tareas t
            LEFT JOIN estado e ON t.estado_id = e.id
            LEFT JOIN prioridad p ON t.prioridad_id = p.id
            LEFT JOIN categoria c ON t.categoria_id = c.id
            WHERE t.user_id = ?
        `;

        const values = [req.user.id];
        if (search) {
            sql += `
                AND (
                    t.title LIKE ? OR 
                    t.description LIKE ? OR 
                    e.nombre LIKE ? OR 
                    p.nombre LIKE ? OR 
                    c.nombre LIKE ?
                )
            `;

            const searchValue = `%${search}%`;
            values.push(searchValue, searchValue, searchValue, searchValue, searchValue);
        }

        const tareas = await pool.query(sql, values);


        const tareasConDiasRestantes = tareas.map(tarea => ({
            ...tarea,
            daysRemaining: calculateDaysRemaining(tarea.Fecfinal)
        }));

        res.render('tareas/list', { 
            tareas: tareasConDiasRestantes,
            query: search 
        });

    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).send('Error al obtener las tareas');
    }
});


router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE from tareas where ID = ?', [id]);
    req.flash('success', 'Task Removed successfully');
    res.redirect('/tareas');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;

    try {
        const tarea = await pool.query('SELECT * FROM tareas WHERE ID = ?', [id]);

        if (tarea.length === 0) {
            return res.redirect('/tareas');
        }

        const estados = await pool.query('SELECT * FROM estado');
        const prioridades = await pool.query('SELECT * FROM prioridad');
        const categorias = await pool.query('SELECT * FROM categoria');

        const fecfinal = tarea[0].Fecfinal ? formatDate(tarea[0].Fecfinal) : '';
        const daysRemaining = calculateDaysRemaining(tarea[0].Fecfinal);

        res.render('tareas/edit', { 
            tarea: { ...tarea[0], Fecfinal: fecfinal, daysRemaining }, 
            estados, 
            prioridades,
            categorias,
            estadoSelected: tarea[0].estado_id,    
            prioridadSelected: tarea[0].prioridad_id, 
            categoriaSelected: tarea[0].categoria_id 
        });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).send('Error al cargar los datos');
    }
});


router.post('/edit/:id', async (req, res) => {
    const { title, description, estado_id, prioridad_id, categoria_id, Fecfinal } = req.body;

    try {
        await pool.query(
            'UPDATE tareas SET title = ?, description = ?, estado_id = ?, prioridad_id = ?, categoria_id = ?, FecFinal = ? WHERE id = ?',
            [title, description, estado_id, prioridad_id, categoria_id, Fecfinal, req.params.id]
        );

        req.flash('success', 'Tarea actualizada correctamente');
        res.redirect('/tareas');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar la tarea");
    }
});

router.get('/contactenos', (req, res) => {
    res.render('tareas/contactenos');
});

router.get('/quienesSomos',(req, res) => {
    res.render('tareas/quienesSomos');
});

module.exports = router;

