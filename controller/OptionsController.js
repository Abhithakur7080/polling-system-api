const Option = require('../models/options');
const Question = require('../models/questions');

module.exports.create = async function(req, res) {
    try {
        // Check if the required fields are present in the request body
        if (!req.body.option) {
            console.log("object");
            return res.status(400).send('Content field is required');
        }

        // Create a new option
        const opt = await Option.create({
            option: req.body.option,
            question: req.params.id
        });

        // Update the option with the add_vote URL
        const updateOpt = await Option.findByIdAndUpdate(opt._id, { "add_vote": `http://localhost:3000/api/v1/options/${opt._id}/add_vote` }, { new: true });
        
        // Save the updated option
        await updateOpt.save();

        // Find the related question and append the option to its options array
        const ques = await Question.findById(req.params.id);
        if (ques) {
            ques.options.push(updateOpt);
            await ques.save();
            console.log('Updated Question:', ques);
            res.send(ques);
        } else {
            res.status(404).send('Question does not exist');
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server Error');
    }
};

module.exports.add_vote = async function(req, res) {
    try {
        // Increment the vote count for the option
        const opt = await Option.findByIdAndUpdate(req.params.id, { $inc: { vote: 1 } }, { new: true });

        if (opt) {
            await opt.save();
            console.log('Updated Option:', opt);
            res.send(opt);
        } else {
            res.status(404).send('Option does not exist');
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server Error');
    }
};

module.exports.delete = async function(req, res) {
    try {
        const opt = await Option.findById(req.params.id);

        if (opt) {
            const quesId = opt.question;

            // Remove the option from the related question's options array
            const ques = await Question.findByIdAndUpdate(quesId, { $pull: { options: req.params.id } });

            // Delete the option
            await Option.findByIdAndDelete(req.params.id);

            console.log('Updated Question:', ques);
            res.send('Option deleted');
        } else {
            res.status(404).send('Option ID does not exist');
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server Error');
    }
};
