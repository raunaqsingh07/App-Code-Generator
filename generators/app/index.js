'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument("configPath", { type: String, required: false });

    this.configFileValidator = (config) => {
      let error = 'Not a valid configuration file or it does not have all the keys required. So the configuration will not be loaded.';
      if (
        !config ||
        !(config["platform"] === "Angular" || config["platform"] === "React" || config["platform"] === "Kotlin" || config["platform"] === "Flutter")) {
        this.configLoaded = false;
        throw error;
      }
      else {
        this.configLoaded = true;
      }
    }
    try {
      if (this.options.configPath) {
        this.configJSON = this.readDestinationJSON(this.options.configPath);
        this.configFileValidator(this.configJSON)
      }
      else {
        this.configLoaded = false;
      }
    }
    catch (e) {
      console.log(e);
    }
  }



  async prompting() {

    this.answers = await this.prompt([
      {
        type: "list",
        name: "platform",
        choices: ["Angular", "React", "Kotlin", "Flutter"],
        message: "Platform",
        default: 0,
        when: !this.configLoaded
      },
      {
        type: "input",
        name: "projectName",
        message: "Your project name",
        default: (answers) => {
          return `${this.configLoaded ? this.configJSON["platform"] : answers.platform.toLowerCase()}-app`;
        }
      },

      {
        type: "input",
        name: "packageName",
        // validate: (input) => (/^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input) ? true : 'The package name you have provided is not a valid Java package name.'),
        message: "What is your package name?",
        default: 'com.myapp',
        when: (answers) => this.configLoaded ? this.configJSON["platform"] : answers.platform === 'Flutter'
      },



      {
        type: "list",
        name: "saveConfig",
        choices: ["Yes", "No"],
        message: "Do you want to save these settings in a configuration file to be reused later?",
        default: 0,
        when: !this.configLoaded
      },
    ]);

    this.answers = { ...this.answers, ...this.configJSON };

    if (this.answers.saveConfig === "Yes") {
      const configJSON = { ...this.answers };
      delete configJSON['projectName'];
      delete configJSON['saveConfig'];
      this.writeDestinationJSON(this.destinationPath(`${this.answers.projectName}-config.json`), configJSON);
    }

    this.env.options.nodePackageManager = 'npm';
    this.destinationRoot(this.answers.projectName);
    this.env.cwd = this.answers.projectName;


  }

  writing() {
    if (this.answers.platform === 'Angular') {

      console.log("\n");
      console.log("----------------------------------------------------------------------");
      console.log("--- Thank you. We are working on this feature. We will inform soon ---");
      console.log("----------------------------------------------------------------------");
    


    }

    else if (this.answers.platform === 'React') {
      console.log("\n");
      console.log("----------------------------------------------------------------------");
      console.log("--- Thank you. We are working on this feature. We will inform soon ---");
      console.log("----------------------------------------------------------------------");

     
    }

    else if (this.answers.platform === 'Kotlin') {
      console.log("\n");
      console.log("----------------------------------------------------------------------");
      console.log("--- Thank you. We are working on this feature. We will inform soon ---");
      console.log("----------------------------------------------------------------------");


    }

    else if (this.answers.platform === 'Flutter') {



      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/README.md'),
        this.destinationPath('README.md'),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/pubspec.yaml'),
        this.destinationPath('pubspec.yaml'),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/pubspec.lock'),
        this.destinationPath('pubspec.lock'),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/starterproject.iml'),
        this.destinationPath('flutter_generator.iml'),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/analysis_options.yaml'),
        this.destinationPath('analysis_options.yaml'),
        this.answers
      );

      // this.fs.copyTpl(
      //   this.templatePath('tempflutter/starterproject/.packages'),
      //   this.destinationPath('.packages'),
      //   this.answers
      // );

      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/.metadata'),
        this.destinationPath('.metadata'),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/.gitignore'),
        this.destinationPath('.gitignore'),
        this.answers
      );



      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/web'),
        this.destinationPath('web'),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/test'),
        this.destinationPath('test'),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/lib'),
        this.destinationPath('lib'),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/ios'),
        this.destinationPath('ios'),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/android'),
        this.destinationPath('android'),
        this.answers
      );



      this.fs.copyTpl(
        this.templatePath('tempflutter/starterproject/.dart_tool'),
        this.destinationPath('.dart_tool'),
        this.answers
      );
    }













    else {
      console.log("\n");
      console.log("----------------------------------------------------------------------");
      console.log("--- Thank you. We are working on this feature. We will inform soon ---");
      console.log("----------------------------------------------------------------------");
    }
  }


  async install() {

    if (this.answers.platform === 'Flutter') {

      this.log(chalk.green('Running flutter doctor'));

      await this.spawnCommandSync('flutter', ['doctor']);


      if (this.answers.projectType === 'MiniApp') {
        this.log(chalk.green('Getting flutter packages'));

        await this.spawnCommandSync('flutter clean', { cwd: this.answers.projectName });

        await this.spawnCommandSync('flutter pub get', { cwd: this.answers.projectName });
      }

      // if (this.answers.widgetOption === 'Yes'){
      //   this.log(chalk.green('adding package home_widget for widget'));
      //   await this.spawnCommandSync('flutter pub add home_widget', { cwd: this.answers.projectName})
      // }

      this.log(chalk.green('installing additional packages'));

      await this.spawnCommandSync('flutter pub upgrade change_app_package_name', { cwd: this.answers.projectName });


      this.log(chalk.green('Modifying package name...'));

      await this.spawnCommandSync('flutter pub run change_app_package_name:main', [this.answers.packageName], { cwd: this.answers.projectName });



    }
  }

  end() {
    this.log(chalk.green.bold('Project generated successfully.\n'));
  }
};

