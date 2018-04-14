################################################################################
# Makefile for installing the EnergyDatabrowser
#
# Makefiles are useful for encapsulating a bunch of UNIX commands into a set
# of 'targets' and 'dependencies'. Each target begins in the leftmost position
# followed by a colon and a list of dependencies.
#
# Each line after the target that begins with a TAB will be executed and should
# be a normal UNIX command.
#
# We can also define variables that can be used later on.

################################################################################
# BEGIN EXAMPLE
# To be run with "make count_files"

dependency:
	echo "This is how many files you have in this directory:"

count_files: dependency
	@ls -1 | wc -l # NOTE: the initial '@' prevents this line from being echoed 
	
# END EXAMPLE
################################################################################


# CONFIGURABLE PARAMETERS ------------------------------------------------------

SERVICE_NAME=EnergyDatabrowser-2018


# OSX INSTALLTION --------------------------------------------------------------

osx_install_data:
	-sudo mkdir /Library/Webserver/Documents/Data
	sudo cp -r Data/* /Library/Webserver/Documents/Data

osx_install_ui: osx_install_data
	-sudo mkdir /Library/Webserver/Documents/$(SERVICE_NAME) # NOTE:  the initial '-' prevents stopping on error
	sudo cp -r UI/* /Library/Webserver/Documents/$(SERVICE_NAME)

osx_install_kushal: osx_install_data
	-sudo mkdir /Library/Webserver/Documents/$(SERVICE_NAME) # NOTE:  the initial '-' prevents stopping on error
	sudo cp -r Avanti/Kushal/* /Library/Webserver/Documents/$(SERVICE_NAME)


# CLEANUP ----------------------------------------------------------------------

clean:
	sudo rm -rf /Library/Webserver/Documents/Data
	sudo rm -rf /Library/Webserver/Documents/$(SERVICE_NAME)
