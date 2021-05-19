/**
 * @author Thorin Tabor
 *
 * Display helpful hints and provide an automated tour of the notebook repository
 *     Depends on the notebook-repository service and GenePattern Notebook
 *
 * Copyright 2015-2019, Regents of the University of California & Broad Institute
 */

define([
    // Load the dependencies
    'base/js/namespace',
    'jquery',
    'base/js/dialog',
    'nbextensions/hints/js/intro.min'], function(Jupyter, $, dialog, introJs) {

    "use strict";

    /**
     * Build and display the hints button
     */
    function display_hints() {
        $("body").append(
            $("<div></div>")
                .attr("id", "gp-hint-box")
                .hide()
                .attr("title", "Welcome to the GenePattern Notebook Workspace")
                .append(
                    $("<i class='fa fa-info' aria-hidden='true'></i>")
                )
                .click(function() {
                    dialog.modal({
                        title : "Welcome to the GenePattern Notebook Workspace",
                        body : $("<div></div>")
                            .append(
                                $("<iframe></iframe>")
                                    .css("height", $(window).height() - 300)
                                    .css("width", "100%")
                                    .attr("src", Jupyter.notebook_list.base_url + "nbextensions/hints/html/hints.html")
                            ),
                        buttons: {
                            "Take a Tour!": {
                                "class": "btn-info",
                                "click": webtour
                            },
                            "OK": {
                                "class": "btn-primary",
                                "click": function () {}
                            }
                        }
                    });
                })
        );

        // Display the hints box
        $("#gp-hint-box").show();
    }

    /***********************************
     * Begin webtour functionality     *
     ***********************************/
    function webtour() {
        // Start the correct webtour for the page
        if (Jupyter.notebook) notebook_webtour();
        else if (Jupyter.notebook_list) tree_webtour();
        else console.log('No webtour for this page');
    }

    function notebook_webtour() {
        const build_webtour = function() {
            // Get a reference to the intro.js instance
            const intro = introJs();

            // Define each of the steps of the tour
            intro.setOptions({
                steps: [
                    {   // STEP 0
                        intro: "<h4>Welcome to the GenePattern Notebook Workspace</h4>" +
                        "GenePattern provides hundreds of analytical tools for the analysis of gene expression (RNA-seq and microarray), sequence variation and copy number, proteomic, flow cytometry, and network analysis - all with a user-friendly interface!"
                    },
                    {   // STEP 1
                        element: document.querySelectorAll('#nbtools-toolbar')[0],
                        intro: "<h4>Notebook Tools</h4>" +
                        "The analysis tools that GenePattern provides can be accessed by clicking on the Tools button. Many tools require that you first log in to your GenePattern account by inserting a 'GenePattern Login' cell."
                    },
                    {   // STEP 2
                        element: document.querySelectorAll('#file_menu')[0],
                        intro: "<h4>Publishing & Sharing</h4>" +
                        "The GenePattern Notebook environment allows you to publish your notebook to the public Notebook Library or to share your notebook with select users. Once you are ready to share or publish your notebook, these features can be accessed from the <strong>File</strong> menu."
                    },
                    {   // STEP 3
                        element: document.querySelectorAll('#help_menu')[0],
                        intro: "<h4>Help Menu</h4>" +
                        "Documentation for GenePattern, Jupyter and related libraries can be found in the Help menu."
                    }
                ]
            });

            // Perform necessary transitions between steps
            intro.onbeforechange(function (element) {
                //switch the active tab to the appropriate one for the step
                if (intro._currentStep === 2) {
                    document.querySelector('#file_menu').style.display = 'block';
                    document.querySelector('#help_menu').style.display = 'none';
                }

                // Switch to the files tab
                else if (intro._currentStep === 3) {
                    document.querySelector('#file_menu').style.display = 'none';
                    document.querySelector('#help_menu').style.display = 'block';
                }
            });

            // Hide menus on exit
            intro.onbeforeexit(function () {
                document.querySelector('#file_menu').style.display = 'none';
                document.querySelector('#help_menu').style.display = 'none';
            });

            // Launch the tour
            intro.start()
        };

        let button_loaded = document.querySelector('#nbtools-toolbar');
        if (button_loaded) build_webtour();
        else setTimeout(build_webtour, 1000);
    }

    function tree_webtour() {
        // Get a reference to the intro.js instance
        const intro = introJs();

        // Define each of the steps of the tour
        intro.setOptions({
            steps: [
                {   // STEP 0
                    intro: "<h4>Welcome to the GenePattern Notebook Workspace</h4>" +
                        "GenePattern provides hundreds of analytical tools for the analysis of gene expression (RNA-seq and microarray), sequence variation and copy number, proteomic, flow cytometry, and network analysis - all with a user-friendly interface!"
                },
                // {   // STEP 1
                //     element: document.querySelectorAll('.repository_tab_link')[0],
                //     intro: "<h4>Notebook Library</h4>" +
                //         "The GenePattern Notebook Workspace provides a library of public notebooks, which can serve as templates or examples when creating your own. These notebooks can be accessed from the <em>Notebook Library</em> tab."
                // },
                // {   // STEP 2
                //     element: document.querySelectorAll('[data-tag=featured]')[0],
                //     intro: "<h4>Featured Notebooks</h4>" +
                //         "Public notebooks are tagged and divided into several different categories. Featured notebooks have been selected because they demonstrate interesting biologic, bioinformatic or machine learning methods."
                // },
                // {   // STEP 3
                //     element: document.querySelectorAll('[data-tag=tutorial]')[0],
                //     intro: "<h4>Tutorial Notebooks</h4>" +
                //         "Tutorial notebooks teach how to use different GenePattern Notebook features, including advanced programmatic features."
                // },
                // {   // STEP 4
                //     element: document.querySelectorAll('[data-tag=community]')[0],
                //     intro: "<h4>Community Notebooks</h4>" +
                //         "Finally, community notebooks are those that have been contributed by the GenePattern Notebook community."
                // },
                // {   // STEP 5
                //     element: document.querySelectorAll('.repo-sidebar h4')[1],
                //     intro: "<h4>Shared Notebooks</h4>" +
                //         "In addition to the public notebooks, the <em>Notebook Library</em> tab also contains those that you have shared with specific collaborators or which have been shared with you. If this option is empty, it is because you haven't shared a notebook with anyone yet.",
                //     position: "right"
                // },
                {   // STEP 6
                    element: document.querySelectorAll('a[href="#notebooks"]')[0],
                    intro: "<h4>Personal Workspace</h4>" +
                        "The <em>Files</em> tab contains your personal workspace. Here you can create new notebooks, upload files or organize your file into folders. When you copy (run) public notebooks from the Notebook Library they will be listed here along with all of the other notebooks, files, and folders that are private to your account."
                },
                {   // STEP 7
                    element: document.querySelectorAll('#notebook_list')[0],
                    intro: "<h4>Opening Notebooks</h4>" +
                        "To open an existing notebook, simply click on the notebook in the list. This will open the notebook in a new tab."
                },
                {   // STEP 8
                    element: document.querySelectorAll('#new-buttons')[0],
                    intro: "<h4>Creating New Notebooks</h4>" +
                        "To create a new blank notebook, click on the <em>New</em> menu and select <em>Notebook</em> in the list. There are also options here for creating new text files, folders and terminal sessions.",
                    position: "left"
                },
                {   // STEP 9
                    element: document.querySelectorAll('#alternate_upload')[0],
                    intro: "<h4>Uploading Files</h4>" +
                        "To upload a file click the <em>Upload</em> button and then select the file that you wish to upload to your personal workspace."
                },
                {   // STEP 10
                    element: document.querySelectorAll('.dynamic-buttons')[0],
                    intro: "<h4>Working With Files</h4>" +
                        "When a file is selected, a menu of options will display here. This menu allows you to rename, move and delete files."
                } //,
                // {   // STEP 11
                //     element: document.querySelectorAll('.dynamic-buttons')[0],
                //     intro: "<h4>Sharing & Publishing</h4>" +
                //         "Finally, when you select a notebook, options will appear allowing you to <em>share</em> this notebook with others or to <em>publish</em> it as a public notebook."
                // }
            ]
        });

        // Perform necessary transitions between steps
        intro.onbeforechange(function(element) {
            // Switch to the files tab
            if (intro._currentStep <= 3) $("#tabs a:first").click();

            // Select a notebook
            else if (intro._currentStep === 4) {
                $('.item_icon.notebook_icon.icon-fixed-width:first').parent().find('input[type=checkbox]').click();
            }
        });

        // Launch the tour
        intro.start();
    }

    function get_cookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function set_cookie(name, value, days=365) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function check_webtour() {
        // Determine the page and cookie name
        let cookie_name = null;
        if (Jupyter.notebook) cookie_name = "GPNBWorkspaceNotebookTour";
        else if (Jupyter.notebook_list) cookie_name = "GPNBWorkspaceTreeTour";
        else return;

        // Get the "Have you seen the tour?" cookie
        const webtour_cookie = get_cookie(cookie_name);

        // If null, set the cookie and show the tour
        if (!webtour_cookie) {
            set_cookie(cookie_name, GenePattern.repo.username);
            webtour();
        }
        else console.log('Webtour already seen');
    }

    function load_css() {
        // Obtain a reference to the Jupyter Notebook object
        let notebook = Jupyter.notebook_list;
        if (!notebook) notebook = Jupyter.notebook;
        if (!notebook) return;

        const STATIC_PATH = notebook.base_url + "nbextensions/hints/css/";

        $('head')
            .append(
                $('<link rel="stylesheet" type="text/css" />')
                    .attr("rel", "stylesheet")
                    .attr("type", "text/css")
                    .attr('href', STATIC_PATH + 'hints.css')
            );
    }

    /**
     * Initialize the hints & webtour
     */
    function load_ipython_extension() {
        load_css();
        const on_index_page = $("#notebooks").is(":visible");
        if (on_index_page) display_hints();
        check_webtour();
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});