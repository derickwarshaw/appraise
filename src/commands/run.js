'use strict';
const compileTemplates = require('../tasks/compile-templates-from-dir'),
	validateRequiredParams = require('../util/validate-required-params'),
	configureFixtureEngines = require('../tasks/configure-fixture-engines'),
	runMdFilesFromDir = require('../tasks/run-md-files-from-dir');

	//log = require('../util/debug-log')

module.exports = function run(args, components) {
	let results, fixtureEngines;
	const resultDir = args['results-dir'],
		examplesDir = args['examples-dir'],
		templatesDir = args['templates-dir'],
		screenshotEngine = components.get('screenshotEngine'),
		resultsRepository = components.get('resultsRepository');

	validateRequiredParams(args, ['examples-dir', 'results-dir', 'templates-dir']);


	return screenshotEngine.start()
		.then(() => configureFixtureEngines(args))
		.then(e => fixtureEngines = e)
		.then(() => resultsRepository.resetResultsDir())
		.then(() => compileTemplates(templatesDir))
		.then(templates => runMdFilesFromDir(examplesDir, resultDir, fixtureEngines, templates, screenshotEngine))
		.then(r => results = r)
		.then(screenshotEngine.stop)
		.then(() => results.summary);
};

module.exports.doc = {
	description: 'Run examples from a local markdown directory',
	priority: 1,
	args: [
		{
			argument: 'examples-dir',
			optional: true,
			description: 'The root directory for the example files',
			default: 'examples subdirectory of the current working directory',
			example: 'specs'
		},
		{
			argument: 'fixtures-dir',
			optional: true,
			description: 'The root directory for the fixture files',
			default: 'same as examples-dir',
			example: 'src/fixtures'
		},
		{
			argument: 'results-dir',
			optional: true,
			description: 'The output directory for results. Note - if it is an existing directory, the old contents will be removed.',
			default: 'results subdirectory in the current working directory',
			example: '/tmp/output'
		},
		{
			argument: 'templates-dir',
			optional: true,
			description: 'The directory containing page templates for the resulting HTML',
			default: 'embedded templates included with the application',
			example: 'src/templates'
		}
	]
};
