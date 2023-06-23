#ARG IMAGE=intersystemsdc/iris-ml-community:latest as build
ARG IMAGE=intersystemsdc/iris-community:latest
#ARG IMAGE=intersystemsdc/iris-community:2023.1.0.226.0-zpm
#ARG IMAGE=intersystemsdc/iris-community:2022.3.0.606.0-zpm
#ARG IMAGE=intersystemsdc/iris-community:2022.1.1.374.0-zpm
FROM $IMAGE

USER root   
        
WORKDIR /opt/irisapp
RUN chown ${ISC_PACKAGE_MGRUSER}:${ISC_PACKAGE_IRISGROUP} /opt/irisapp
USER ${ISC_PACKAGE_MGRUSER}

COPY source source
COPY build build
COPY module.xml module.xml
COPY iris.script /tmp/iris.script

RUN iris start IRIS \
	&& iris session IRIS < /tmp/iris.script \
    && iris stop IRIS quietly
